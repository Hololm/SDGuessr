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

    response = jsonify({
        "user": user_response,
        "assistant": assistant_response,
    })

    # Disable caching
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"

    return response

if __name__ == '__main__':
    app.run(port=8080)
