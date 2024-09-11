from flask import Flask, jsonify
from flask_cors import CORS
from main import main


#app instance
app = Flask(__name__)
CORS(app)

@app.route("/api/home", methods=["GET"])

def return_home():
    assistant_response = main()

    user_response = assistant_response.get("content").get("user")
    assistant_response = assistant_response.get("content").get("assistant")

    return jsonify({
        "user": user_response,
        "assistant": assistant_response,
    })

if __name__ == '__main__':
    app.run(debug=True, port=8080)
