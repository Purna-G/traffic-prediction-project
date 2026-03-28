import streamlit as st
import pickle
import pandas as pd

def load_model(file):
    with open(file, 'rb') as f:
        return pickle.load(f)

def show_predict_page():
    st.title("🚦 Traffic Prediction")

    junction = st.selectbox("Select Junction", [1, 2, 3, 4])

    year = st.number_input("Year", 2015, 2030, 2023)
    month = st.number_input("Month", 1, 12, 6)
    day = st.number_input("Day", 1, 31, 15)
    hour = st.number_input("Hour", 0, 23, 12)

    day_name = st.selectbox(
        "Day Name",
        ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    )

    if st.button("Predict"):
        
        model_file = f"final_model_{junction}.pkl"
        data = load_model(model_file)
        
        model = data['model']
        le = data['le_day']

        day_encoded = le.transform([day_name])[0]

        input_data = pd.DataFrame([{
            'Year': year,
            'Month': month,
            'Day': day,
            'Hour': hour,
            'DayEncoded': day_encoded
        }])

        prediction = model.predict(input_data)[0]

        st.success(f"🚗 Predicted Traffic: {int(prediction)}")