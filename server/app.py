from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# In-memory store for flashcards
flashcards = [
    {"id": 1, "question": "What is the capital of France?", "answer": "Paris"},
    {"id": 2, "question": "What is 2 + 2?", "answer": "4"}
]

# Get all flashcards
@app.route('/api/flashcards', methods=['GET'])
def get_flashcards():
    return jsonify(flashcards)

# Create a new flashcard
@app.route('/api/flashcards', methods=['POST'])
def create_flashcard():
    new_flashcard = request.json
    new_flashcard['id'] = max(card['id'] for card in flashcards) + 1 if flashcards else 1
    flashcards.append(new_flashcard)
    return jsonify(new_flashcard), 201

# Delete a flashcard by ID
@app.route('/api/flashcards/<int:flashcard_id>', methods=['DELETE'])
def delete_flashcard(flashcard_id):
    global flashcards
    flashcards = [card for card in flashcards if card['id'] != flashcard_id]
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
