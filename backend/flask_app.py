from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import datetime
import calendar
import requests
from geopy.geocoders import Nominatim
import os
import json

from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)
CORS(app)

# Security: Rate Limiting
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

# Load Models (Robust Path Handling)
base_dir = os.path.dirname(os.path.abspath(__file__))

def load_model(filename):
    try:
        path = os.path.join(base_dir, filename)
        with open(path, 'rb') as f:
            model_package = pickle.load(f)
            # Handle both old and new model formats
            if 'models' in model_package:
                # New format: multiple models, use the best one
                best_model_name = model_package.get('best_model', 'XGBoost')
                return model_package['models'].get(best_model_name, model_package['models']['XGBoost'])
            else:
                # Old format: single model
                return model_package['model']
    except Exception as e:
        print(f"Error loading {filename}: {e}")
        return None

# Load all 4 models
m1 = load_model('final_model_1.pkl')
m2 = load_model('final_model_2.pkl')
m3 = load_model('final_model_3.pkl') # Might be missing, load_model handles it
m4 = load_model('final_model_4.pkl')

if not any([m1, m2, m3, m4]):
    print("Warning: No models loaded. Predictions will use fallback logic.")

# Extract label encoder from Model 1 if available
le_day = {}
if m1 and isinstance(m1, dict) and 'le_day' in m1:
    le_day = m1['le_day']
    m1 = m1['model']
if m2 and isinstance(m2, dict): m2 = m2['model']
if m3 and isinstance(m3, dict): m3 = m3['model']
if m4 and isinstance(m4, dict): m4 = m4['model']

# Helpers
def date_to_day_int(year, month, date):
    dt = datetime.datetime(year, month, date)
    day_str = calendar.day_name[dt.weekday()]
    return le_day.get(day_str, 0) # Default to 0 if not found

def get_coordinates(location):
    geolocator = Nominatim(user_agent="traffic_app_dashboard_v1")
    try:
        location_data = geolocator.geocode(location)
        if location_data:
            return location_data.latitude, location_data.longitude
        return None, None
    except:
        return None, None

@app.route('/api/autocomplete', methods=['GET'])
def autocomplete():
    """Get location suggestions from Nominatim based on user input."""
    query = request.args.get('q', '').strip()
    
    if len(query) < 2:
        return jsonify([])
    
    try:
        # Use Nominatim search API for autocomplete
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            'q': query,
            'format': 'json',
            'limit': 6,
            'addressdetails': 1
        }
        headers = {
            'User-Agent': 'TrafficInsightDashboard/1.0'
        }
        
        response = requests.get(url, params=params, headers=headers, timeout=5)
        data = response.json()
        
        # Format results for frontend
        suggestions = []
        for item in data:
            display_name = item.get('display_name', '')
            # Shorten display name to city, region, country
            parts = display_name.split(', ')
            if len(parts) >= 3:
                short_name = ', '.join(parts[:3])
            else:
                short_name = display_name
                
            suggestions.append({
                'name': short_name,
                'full_name': display_name,
                'lat': float(item.get('lat', 0)),
                'lon': float(item.get('lon', 0)),
                'type': item.get('type', 'place')
            })
        
        return jsonify(suggestions)
        
    except Exception as e:
        print(f"Autocomplete error: {e}")
        return jsonify([])

def get_route_details(lat1, lon1, lat2, lon2):
    # OSRM Public API
    url = f"http://router.project-osrm.org/route/v1/driving/{lon1},{lat1};{lon2},{lat2}?overview=false"
    try:
        r = requests.get(url)
        data = r.json()
        if data['code'] == 'Ok':
            # distance in meters, duration in seconds
            return data['routes'][0]['distance'], data['routes'][0]['duration']
        return 0, 0
    except:
        return 0, 0

def get_weather(lat, lon, date_str):
    # Open-Meteo API
    # Note: Free API works best for forecast (next 7 days) or current. 
    # For simplicity, if date is in future 7 days, get forecast. If far future, use "Average".
    
    # Check if date is within next 7 days
    target_date = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
    today = datetime.date.today()
    
    if target_date < today:
        # Historical not fully supported in free wrapper easily without archive API
        return "Unknown", 0.0 # fallback
    
    days_diff = (target_date - today).days
    
    if days_diff > 7:
        return "Clear", 20.0 # fallback average
        
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=weathercode,temperature_2m_max&timezone=auto"
    try:
        r = requests.get(url)
        data = r.json()
        if 'daily' in data:
            # simple mapping of wmo code to string
            # 0=Clear, 1-3=Cloudy, 51-67=Rain, 71-77=Snow
            code = data['daily']['weathercode'][days_diff] if days_diff < len(data['daily']['weathercode']) else 0
            temp = data['daily']['temperature_2m_max'][days_diff] if days_diff < len(data['daily']['temperature_2m_max']) else 20
            
            weather_desc = "Clear"
            if 1 <= code <= 3: weather_desc = "Cloudy"
            elif 51 <= code <= 67: weather_desc = "Rainy"
            elif 71 <= code <= 77: weather_desc = "Snowy"
            elif code >= 95: weather_desc = "Stormy"
            
            return weather_desc, temp
        return "Clear", 20.0
    except:
        return "Clear", 20.0

@app.route('/api/predict', methods=['POST'])
@limiter.limit("10 per minute")
def predict():
    data = request.json
    try:
        # Inputs
        from_loc = data.get('from_loc')
        to_loc = data.get('to_loc')
        date_str = data.get('date') # YYYY-MM-DD
        time_str = data.get('time') # HH:MM
        is_peak_hour = data.get('is_peak_hour', False)
        is_holiday = data.get('is_holiday', False)
        
        # Parse Date/Time
        dt = datetime.datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
        year, month, day_num, hour = dt.year, dt.month, dt.day, dt.hour
        day_enc = date_to_day_int(year, month, day_num)
        
        # 1. Geocoding
        lat1, lon1 = get_coordinates(from_loc)
        lat2, lon2 = get_coordinates(to_loc)
        
        if not lat1 or not lat2:
            return jsonify({'error': 'Invalid Locations'}), 400
            
        # 2. Routing (Distance/Duration)
        distance_m, duration_s = get_route_details(lat1, lon1, lat2, lon2)
        distance_km = distance_m / 1000.0
        base_duration_min = duration_s / 60.0
        
        # 3. Weather
        weather, temp = get_weather(lat1, lon1, date_str)
        
        # 4. Traffic Prediction (Base Model)
        input_features = [[year, month, day_num, hour, day_enc]]
        
        pred1 = m1.predict(input_features)[0] if m1 else 0
        pred2 = m2.predict(input_features)[0] if m2 else 0
        pred3 = m3.predict(input_features)[0] if m3 else 0
        pred4 = m4.predict(input_features)[0] if m4 else 0
        
        avg_vehicles = (pred1 + pred2 + pred3 + pred4) / 4.0
        
        # 5. Modifiers
        traffic_factor = 1.0
        if avg_vehicles > 40: traffic_factor = 1.5
        elif avg_vehicles > 25: traffic_factor = 1.2
        else: traffic_factor = 1.0
        
        weather_factor = 1.0
        if weather == "Rainy": weather_factor = 1.2
        elif weather == "Snowy": weather_factor = 1.4
        elif weather == "Stormy": weather_factor = 1.5
        
        # Peak hour and holiday factors
        peak_hour_factor = 1.4 if is_peak_hour else 1.0  # 40% increase during peak hours
        holiday_factor = 0.8 if is_holiday else 1.0     # 20% decrease on holidays
        
        final_duration_min = base_duration_min * traffic_factor * weather_factor * peak_hour_factor * holiday_factor
        
        is_heavy = avg_vehicles > 30 or weather_factor > 1.2
        traffic_level = "High" if is_heavy else ("Medium" if avg_vehicles > 20 else "Low")
        
        result = {
            'vehicle_count': int(avg_vehicles),
            'traffic_level': traffic_level,
            'distance_km': round(distance_km, 1),
            'estimated_duration_min': round(final_duration_min, 0),
            'weather_condition': weather,
            'temperature': round(temp, 1),
            'route_from': from_loc,
            'route_to': to_loc
        }
        
        # Save to history
        import uuid
        history = load_history()
        history_entry = {
            "id": str(uuid.uuid4())[:8],
            "date": date_str,
            "inputs": {
                "from_loc": from_loc,
                "to_loc": to_loc,
                "date": date_str,
                "time": time_str
            },
            "prediction": result,
            "created_at": datetime.datetime.now().isoformat()
        }
        history.insert(0, history_entry)  # Most recent first
        if len(history) > 50:  # Keep last 50 predictions
            history = history[:50]
        save_history(history)
        
        return jsonify(result)
        
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

# History Storage (JSON File)
history_file = os.path.join(base_dir, 'prediction_history.json')

def load_history():
    try:
        if os.path.exists(history_file):
            with open(history_file, 'r') as f:
                return json.load(f)
        return []
    except:
        return []

def save_history(history):
    try:
        with open(history_file, 'w') as f:
            json.dump(history, f, indent=2)
    except Exception as e:
        print(f"Error saving history: {e}")

@app.route('/api/history', methods=['GET'])
def get_history():
    return jsonify(load_history())

# Load Traffic Data (Cache in Memory)
traffic_data = None
try:
    csv_path = os.path.join(base_dir, 'traffic.csv')
    if os.path.exists(csv_path):
        traffic_data = pd.read_csv(csv_path)
        # Pre-processing for performance
        traffic_data['DateTime'] = pd.to_datetime(traffic_data['DateTime'])
        traffic_data['Date'] = traffic_data['DateTime'].dt.date
        traffic_data['Weekday'] = traffic_data['DateTime'].dt.day_name()
        traffic_data['Hour'] = traffic_data['DateTime'].dt.hour
        print("Traffic data cached successfully.")
    else:
        print(f"Warning: traffic.csv not found at {csv_path}")
except Exception as e:
    print(f"Error caching traffic data: {e}")

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    try:
        if traffic_data is None:
            return jsonify({
                "total_vehicles": 0,
                "daily": [],
                "weekday": [],
                "seasonal": []
            })
        
        df = traffic_data
        
        # Total vehicle count
        total_vehicles = int(df['Vehicles'].sum())
        
        # 1. Daily Trend (Group by Date) - Limit to last 30 entries for chart clarity
        daily_traffic = df.groupby('Date')['Vehicles'].mean().reset_index()
        daily_json = [{"date": str(row['Date']), "traffic": int(row['Vehicles'])} for index, row in daily_traffic.tail(30).iterrows()]
        
        # 2. Weekday Analysis
        weekday_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        weekday_traffic = df.groupby('Weekday')['Vehicles'].mean().reindex(weekday_order).reset_index()
        weekday_json = [{"day": row['Weekday'], "traffic": int(row['Vehicles'])} for index, row in weekday_traffic.iterrows()]
        
        # 3. Hourly Analysis
        hourly_traffic = df.groupby('Hour')['Vehicles'].mean().reset_index()
        seasonal_json = [{"season": f"{int(row['Hour'])}:00", "traffic": int(row['Vehicles'])} for index, row in hourly_traffic.iterrows()]

        # 4. Monthly Trend Analysis
        df['Month'] = df['DateTime'].dt.month
        df['MonthName'] = df['DateTime'].dt.strftime('%b')
        monthly_traffic = df.groupby(['Month', 'MonthName'])['Vehicles'].mean().reset_index()
        monthly_traffic = monthly_traffic.sort_values('Month')
        monthly_json = [{"month": row['MonthName'], "traffic": int(row['Vehicles'])} for index, row in monthly_traffic.iterrows()]

        return jsonify({
            "total_vehicles": total_vehicles,
            "daily": daily_json,
            "weekday": weekday_json,
            "seasonal": seasonal_json,
            "monthly": monthly_json
        })
    except Exception as e:
        print(f"Analytics error: {e}")
        return jsonify({
            "total_vehicles": 0,
            "daily": [],
            "weekday": [],
            "seasonal": []
        })

@app.route('/api/junction-predict', methods=['POST'])
@limiter.limit("10 per minute")
def predict_junction_vehicles():
    data = request.json
    try:
        # Inputs
        source_junction = int(data.get('source_junction', 1))
        dest_junction = int(data.get('dest_junction', 1))
        date_str = data.get('date', datetime.date.today().strftime('%Y-%m-%d'))
        time_str = data.get('time', '12:00')
        
        # Validate junctions
        if source_junction not in [1, 2, 3, 4] or dest_junction not in [1, 2, 3, 4]:
            return jsonify({'error': 'Invalid junction. Must be 1, 2, 3, or 4'}), 400
            
        if source_junction == dest_junction:
            return jsonify({'error': 'Source and destination junctions must be different'}), 400
        
        # Parse Date/Time
        dt = datetime.datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
        year, month, day_num, hour = dt.year, dt.month, dt.day, dt.hour
        day_enc = date_to_day_int(year, month, day_num)
        
        # Get models for source and destination junctions
        models = [m1, m2, m3, m4]
        source_model = models[source_junction - 1] if source_junction <= len(models) else None
        dest_model = models[dest_junction - 1] if dest_junction <= len(models) else None
        
        # Predict vehicles for source junction
        input_features = [[year, month, day_num, hour, day_enc]]
        source_vehicles = float(source_model.predict(input_features)[0]) if source_model else 0.0
        
        # Predict vehicles for destination junction
        dest_vehicles = float(dest_model.predict(input_features)[0]) if dest_model else 0.0
        
        # Calculate total vehicle count between junctions
        total_vehicles = source_vehicles + dest_vehicles
        
        # Get intermediate junctions if they exist
        intermediate_junctions = []
        min_junc = min(source_junction, dest_junction)
        max_junc = max(source_junction, dest_junction)
        
        # Add intermediate junctions data
        for junc in range(min_junc + 1, max_junc):
            junc_model = models[junc - 1] if junc <= len(models) else None
            junc_vehicles = float(junc_model.predict(input_features)[0]) if junc_model else 0.0
            total_vehicles += junc_vehicles
            intermediate_junctions.append({
                'junction': junc,
                'vehicle_count': round(junc_vehicles, 1)
            })
        
        # Calculate average for traffic level determination
        total_junctions = abs(dest_junction - source_junction) + 1
        avg_for_level = total_vehicles / total_junctions
        
        # Determine traffic level
        traffic_level = "Low"
        if avg_for_level > 30:
            traffic_level = "High"
        elif avg_for_level > 20:
            traffic_level = "Medium"
        
        result = {
            'source_junction': source_junction,
            'dest_junction': dest_junction,
            'total_vehicle_count': round(total_vehicles, 1),
            'source_vehicle_count': round(source_vehicles, 1),
            'dest_vehicle_count': round(dest_vehicles, 1),
            'intermediate_junctions': intermediate_junctions,
            'traffic_level': traffic_level,
            'date': date_str,
            'time': time_str
        }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Junction prediction error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/models', methods=['GET'])
def get_models():
    # Return real metrics from loaded model packages
    models_info = []
    
    model_names = ["Junction 1 Model", "Junction 2 Model", "Junction 3 Model", "Junction 4 Model"]
    model_filenames = ['final_model_1.pkl', 'final_model_2.pkl', 'final_model_3.pkl', 'final_model_4.pkl']
    
    for i, (name, filename) in enumerate(zip(model_names, model_filenames)):
        # Try to load metrics from the model package
        try:
            path = os.path.join(base_dir, filename)
            if os.path.exists(path):
                with open(path, 'rb') as f:
                    model_package = pickle.load(f)
                
                if isinstance(model_package, dict) and 'metrics' in model_package:
                    metrics = model_package['metrics']
                    models_info.append({
                        "name": name,
                        "accuracy": round(metrics.get('accuracy', 0), 2),
                        "rmse": round(metrics.get('rmse', 0), 2),
                        "mae": round(metrics.get('mae', 0), 2),
                        "is_best": i == 0,
                        "status": "Loaded"
                    })
                else:
                    # Model exists but no metrics stored
                    models_info.append({
                        "name": name,
                        "accuracy": 0,
                        "rmse": 0,
                        "mae": 0,
                        "is_best": False,
                        "status": "Loaded (No Metrics)"
                    })
            else:
                models_info.append({
                    "name": name,
                    "accuracy": 0,
                    "rmse": 0,
                    "mae": 0,
                    "is_best": False,
                    "status": "Not Available"
                })
        except Exception as e:
            models_info.append({
                "name": name,
                "accuracy": 0,
                "rmse": 0,
                "mae": 0,
                "is_best": False,
                "status": f"Error: {str(e)[:30]}"
            })
    
    # Mark the best model (highest accuracy)
    if models_info:
        best_idx = max(range(len(models_info)), key=lambda i: models_info[i]['accuracy'])
        for i, m in enumerate(models_info):
            m['is_best'] = (i == best_idx and m['accuracy'] > 0)
    
    return jsonify(models_info)

@app.route('/api/retrain', methods=['POST'])
@limiter.limit("2 per hour")
def retrain_models():
    """Trigger model retraining using the train_models.py script."""
    try:
        data = request.json or {}
        model_name = data.get('model', 'all')
        
        # Run the training script
        import subprocess
        train_script = os.path.join(base_dir, 'train_models.py')
        
        if not os.path.exists(train_script):
            return jsonify({
                'success': False,
                'error': 'Training script not found'
            }), 404
        
        # Run training in subprocess
        result = subprocess.run(
            ['python', train_script],
            cwd=base_dir,
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )
        
        if result.returncode == 0:
            return jsonify({
                'success': True,
                'message': f'Successfully retrained models. Please restart the server to load new models.',
                'output': result.stdout[-500:] if len(result.stdout) > 500 else result.stdout
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Training failed',
                'details': result.stderr[-500:] if len(result.stderr) > 500 else result.stderr
            }), 500
            
    except subprocess.TimeoutExpired:
        return jsonify({
            'success': False,
            'error': 'Training timed out (exceeded 5 minutes)'
        }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    # Production configuration: Debug=False, threaded=True
    app.run(debug=False, port=5000, threaded=True)
