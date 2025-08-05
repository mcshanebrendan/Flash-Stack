from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

# Database config (SQLite file)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flashcards.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Database model
class Flashcard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(200), nullable=False)
    answer = db.Column(db.String(200), nullable=False)

    def to_dict(self):
        return {"id": self.id, "question": self.question, "answer": self.answer}

# Initialize DB (create tables)
with app.app_context():
    db.create_all()

# Get all flashcards
@app.route('/api/flashcards', methods=['GET'])
def get_flashcards():
    flashcards = Flashcard.query.all()
    return jsonify([card.to_dict() for card in flashcards])

# Create a new flashcard
@app.route('/api/flashcards', methods=['POST'])
def create_flashcard():
    data = request.json
    new_card = Flashcard(question=data['question'], answer=data['answer'])
    db.session.add(new_card)
    db.session.commit()
    return jsonify(new_card.to_dict()), 201

# Delete a flashcard by ID
@app.route('/api/flashcards/<int:flashcard_id>', methods=['DELETE'])
def delete_flashcard(flashcard_id):
    card = Flashcard.query.get_or_404(flashcard_id)
    db.session.delete(card)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
