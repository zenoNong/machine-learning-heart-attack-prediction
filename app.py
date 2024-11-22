from flask import Flask, request, jsonify, render_template
import joblib

app = Flask(__name__)

# Load models
models = {
    # "RandomForest": joblib.load("models/random_forest_model.pkl"),
    "LogisticRegression": joblib.load("models/logreg_model.pkl"),
    # "SVC": joblib.load("models/svc_model.pkl"),
    "KNN": joblib.load("models/knn_model.pkl"),
    "DecisionTree": joblib.load("models/decision_tree_model.pkl"),
}

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get form data
        data = request.form
        
        # Convert form data to features list
        features = [
            float(data.get('age', 0)),
            float(data.get('gender', 0)),
            float(data.get('height', 0)),
            float(data.get('weight', 0)),
            float(data.get('ap_hi', 0)),
            float(data.get('ap_lo', 0)),
            float(data.get('cholesterol', 1)),
            float(data.get('gluc', 1)),
            float(data.get('smoke', 0)),
            float(data.get('alco', 0)),
            float(data.get('active', 0)),
            float(data.get('bmi', 0))
        ]

        # Make predictions using each model
        predictions = {}
        for model_name, model in models.items():
            try:
                pred = model.predict([features])[0]
                predictions[model_name] = int(pred)
            except Exception as e:
                print(f"Error with {model_name}: {str(e)}")
                predictions[model_name] = 0

        # Calculate final prediction (majority voting)
        final_prediction = 1 if sum(predictions.values()) / len(predictions) >= 0.5 else 0

        return render_template('result.html',
                             final_prediction=final_prediction,
                             individual_predictions=predictions)

    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
