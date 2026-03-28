<<<<<<< HEAD
# Welcome to your frontend project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the (https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Terminal 1: Frontend
cd traffic-insight-dashboard
npm install
npm run dev
# Runs on http://localhost:8080

# Terminal 2: Backend
cd traffic-insight-dashboard/backend
pip install -r requirements.txt
python flask_app.py
# Runs on http://localhost:5000
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open (https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
=======
# traffic-prediction-project
>>>>>>> 33ccb9195e8c391c5e5ae9b8d81f4bc65c8e9b78
>>>>>>>  # traffic-prediction-project
# 🚦 Traffic Prediction System

## 📌 Project Overview

This project is a **Machine Learning-based Traffic Prediction System** that predicts vehicle traffic at different junctions using historical data.

The system uses multiple regression models and selects the best-performing model (**XGBoost**) to provide accurate predictions.

---

## 🎯 Features

* Predict traffic volume for 4 different junctions
* User-friendly interface using Streamlit
* Real-time prediction based on date and time inputs
* Model comparison (Decision Tree, Linear Regression, XGBoost)
* Saved models using Pickle for fast predictions

---

## 🧠 Machine Learning Models Used

* Decision Tree Regressor
* Linear Regression
* XGBoost Regressor ✅ (Best Model)

---

## 📊 Best Model Selection

| Junction   | Best Model |
| ---------- | ---------- |
| Junction 1 | XGBoost    |
| Junction 2 | XGBoost    |
| Junction 3 | XGBoost    |
| Junction 4 | XGBoost    |

---

## ⚙️ Tech Stack

* Python 🐍
* Pandas & NumPy
* Scikit-learn
* XGBoost
* Streamlit
* Git & GitHub

---

## 📂 Project Structure

```
traffic-insight-dashboard/
│
├── backend/
│   ├── app.py
│   ├── predict_page.py
│   ├── final_model_1.pkl
│   ├── final_model_2.pkl
│   ├── final_model_3.pkl
│   ├── final_model_4.pkl
│
├── data/
│   └── traffic.csv
│
├── plots/
│
├── README.md
```

---

## 🚀 How to Run the Project

### 1️⃣ Clone the repository

```
git clone https://github.com/Purna-G/traffic-prediction-project.git
cd traffic-prediction-project
```

### 2️⃣ Create environment

```
conda create -n streamlit_newenv python=3.10
conda activate streamlit_newenv
```

### 3️⃣ Install dependencies

```
pip install -r requirements.txt
```

### 4️⃣ Run the app

```
python -m streamlit run app.py
```

---

## 📸 Output

* Select Junction
* Enter Date & Time
* Predict Traffic Volume

---

## 💡 Future Improvements

* Add real-time traffic data
* Improve UI/UX
* Deploy the app online
* Add visualization dashboards

---

## 👨‍💻 Author

**Purna G**

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!

