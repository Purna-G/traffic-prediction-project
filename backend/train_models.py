"""
Model Training Script with Internet Data Fetching
Trains ONLY XGBoost model
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import pickle
import os
import requests
from io import StringIO

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'traffic.csv')

# Dataset URLs
DATASET_URLS = [
    "https://raw.githubusercontent.com/rashmiag/Traffic-Volume-Prediction/main/Metro_Interstate_Traffic_Volume.csv",
    "https://archive.ics.uci.edu/ml/machine-learning-databases/00492/Metro_Interstate_Traffic_Volume.csv.gz",
]

# Generate synthetic data (fallback)
def generate_traffic_data():
    np.random.seed(42)
    dates = pd.date_range(start='2015-01-01', end='2017-12-31', freq='H')

    records = []
    for junction in range(1, 5):
        for dt in dates:
            base = 15 + (junction * 5)

            hour = dt.hour
            if 7 <= hour <= 9:
                hour_factor = 2.5
            elif 17 <= hour <= 19:
                hour_factor = 2.8
            elif 0 <= hour <= 5:
                hour_factor = 0.3
            else:
                hour_factor = 1.0

            day_factor = 1.2 if dt.weekday() < 5 else 0.7

            month = dt.month
            if month in [6, 7, 8]:
                season_factor = 1.1
            elif month in [12, 1, 2]:
                season_factor = 0.9
            else:
                season_factor = 1.0

            vehicles = int(base * hour_factor * day_factor * season_factor + np.random.normal(0, 3))
            vehicles = max(1, vehicles)

            records.append({
                'DateTime': dt.strftime('%Y-%m-%d %H:%M:%S'),
                'Junction': junction,
                'Vehicles': vehicles,
                'ID': f"{dt.strftime('%Y%m%d%H')}{junction}"
            })

    return pd.DataFrame(records)

# Download or generate data
def download_or_generate_data():
    if os.path.exists(DATA_PATH):
        try:
            df = pd.read_csv(DATA_PATH)
            if len(df) > 1000:
                return df
        except:
            pass

    for url in DATASET_URLS:
        try:
            response = requests.get(url, timeout=30)
            if response.status_code == 200:
                if url.endswith('.gz'):
                    import gzip
                    content = gzip.decompress(response.content).decode('utf-8')
                else:
                    content = response.text

                df = pd.read_csv(StringIO(content))

                if 'traffic_volume' in df.columns:
                    df = df.rename(columns={
                        'date_time': 'DateTime',
                        'traffic_volume': 'Vehicles'
                    })
                    df['Junction'] = 1
                    df['ID'] = range(len(df))

                return df
        except:
            continue

    df = generate_traffic_data()
    df.to_csv(DATA_PATH, index=False)
    return df

# Preprocessing
def load_and_preprocess_data(df):
    df['DateTime'] = pd.to_datetime(df['DateTime'])

    df['Year'] = df['DateTime'].dt.year
    df['Month'] = df['DateTime'].dt.month
    df['Day'] = df['DateTime'].dt.day
    df['Hour'] = df['DateTime'].dt.hour
    df['DayOfWeek'] = df['DateTime'].dt.dayofweek
    df['DayName'] = df['DateTime'].dt.day_name()

    le_day = LabelEncoder()
    df['DayEncoded'] = le_day.fit_transform(df['DayName'])

    day_mapping = dict(zip(le_day.classes_, le_day.transform(le_day.classes_)))

    return df, day_mapping

# Train XGBoost model
def train_model_for_junction(df, junction_id, day_mapping):
    print(f"\nTraining XGBoost for Junction {junction_id}")

    if 'Junction' in df.columns:
        junction_data = df[df['Junction'] == junction_id].copy()
    else:
        junction_data = df.copy()

    features = ['Year', 'Month', 'Day', 'Hour', 'DayEncoded']
    X = junction_data[features]
    y = junction_data['Vehicles']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = XGBRegressor(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        n_jobs=-1,
        random_state=42
    )

    print("Training XGBoost model...")
    model.fit(X_train, y_train)

    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)

    train_r2 = r2_score(y_train, y_pred_train)
    test_r2 = r2_score(y_test, y_pred_test)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
    mae = mean_absolute_error(y_test, y_pred_test)

    accuracy = max(0, min(test_r2 * 100, 100))

    print(f"Accuracy: {accuracy:.2f}% | RMSE: {rmse:.2f} | MAE: {mae:.2f}")

    model_package = {
        'model': model,
        'metrics': {
            'accuracy': accuracy,
            'rmse': rmse,
            'mae': mae
        },
        'features': features,
        'junction': junction_id
    }

    return model_package

# Save model
def save_model(model_package, junction_id):
    filename = f'final_model_{junction_id}.pkl'
    filepath = os.path.join(BASE_DIR, filename)

    with open(filepath, 'wb') as f:
        pickle.dump(model_package, f)

    print(f"Saved model: {filename}")

# Main function
def main():
    print("TRAFFIC PREDICTION - XGBoost ONLY")

    raw_df = download_or_generate_data()
    df, day_mapping = load_and_preprocess_data(raw_df)

    if 'Junction' in df.columns:
        junctions = sorted(df['Junction'].unique())
    else:
        junctions = [1, 2, 3, 4]

    for junction_id in junctions:
        model_package = train_model_for_junction(df, junction_id, day_mapping)
        save_model(model_package, junction_id)

    print("\nTraining completed successfully!")

if __name__ == '__main__':
    main()
