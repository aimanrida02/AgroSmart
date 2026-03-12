import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
import pickle

# load dataset
data = pd.read_csv("fertilizer_recommendation.csv")

X = data[["nitrogen","phosphorus","potassium","temperature","humidity","ph"]]
y = data["fertilizer"]

X_train, X_test, y_train, y_test = train_test_split(X,y,test_size=0.2)

model = DecisionTreeClassifier()
model.fit(X_train,y_train)

# save trained model
pickle.dump(model, open("model.pkl","wb"))

print("Model trained and saved")
