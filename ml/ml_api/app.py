from fastapi import FastAPI
import pickle
import os

from ml_api.utils import (
    get_name_sim,
    get_addr_sim,
    get_dob_sim,
    get_aadhaar_sim,
    get_id_sim
)
from ml_api.decision import final_decision

app = FastAPI()

# ✅ Load model safely
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_path = os.path.join(BASE_DIR, "ml_model", "voter_rf_model.pkl")

with open(model_path, "rb") as f:
    model = pickle.load(f)

print("Model expects:", model.feature_names_in_)  # debug


# 🔹 Feature creation
def create_features(user, record):
    return {
        "name_sim": get_name_sim(user.get("name"), record.get("name")),
        "dob_sim": get_dob_sim(user.get("dob"), record.get("dob")),
        "addr_sim": get_addr_sim(user.get("address"), record.get("address")),
        "aadhaar_sim": get_aadhaar_sim(user.get("aadhaar"), record.get("aadhaar")),
        "id_sim": get_id_sim(user.get("voter_id"), record.get("voter_id"))
    }


# 🔹 API endpoint
@app.post("/verify")
def verify(data: dict):
    try:
        user = data["user"]
        record = data["record"]

        features = create_features(user, record)

        result = final_decision(features, model, user, record)

        return {
            "status": result,
            "features": features
        }

    except Exception as e:
        return {"error": str(e)}