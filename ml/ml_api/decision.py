import pandas as pd

def final_decision(features, model, user, record):

    # 🚨 HARD RULES
    if features["dob_sim"] == 0:
        return "Suspicious"

    if features["aadhaar_sim"] == 0:
        return "Suspicious"

    if features["id_sim"] == 0:
        return "Suspicious"

    # ⚠️ REVIEW ZONE (fixed)
    if (
        0.75 <= features["name_sim"] < 0.95 or
        0.75 <= features["addr_sim"] < 0.95
    ):
        return "Review"

    # 🤖 ML only for strong matches
    df = pd.DataFrame([features])[
        ["name_sim", "dob_sim", "addr_sim", "aadhaar_sim", "id_sim"]
    ]

    return model.predict(df)[0]