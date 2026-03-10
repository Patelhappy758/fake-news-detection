import pickle

with open("isot_trained_models.pkl", "rb") as f:
    data = pickle.load(f)

print("TYPE:", type(data))
print("CONTENT:", data)
