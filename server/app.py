from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Sample route
@app.route('/api/flashcards', methods=['GET'])
def get_flashcards():
    # This will eventually pull from DB
    flashcards = [
        {"question": "What is the capital of France?", "answer": "Paris"},
        {"question": "What is 2 + 2?", "answer": "4"}
    ]
    return jsonify(flashcards)

if __name__ == '__main__':
    app.run(debug=True)
