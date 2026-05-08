from rapidfuzz import fuzz

# Name similarity (fuzzy)
def get_name_sim(a, b):
    return fuzz.token_sort_ratio(a or "", b or "") / 100

# Address similarity (fuzzy)
def get_addr_sim(a, b):
    return fuzz.token_set_ratio(a or "", b or "") / 100

# DOB (strict)
def get_dob_sim(a, b):
    return 1 if a == b else 0

# Aadhaar (strict)
def get_aadhaar_sim(a, b):
    return 1 if a == b else 0

# Voter ID (this = id_sim in model)
def get_id_sim(a, b):
    return 1 if a == b else 0