from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import face_recognition
import pickle
import pandas as pd
import os

app = Flask(__name__)
CORS(app, origins="*")  # Enable CORS for all origins

# Load the face encodings from the pickle file
with open('face_encodings_single_img.pkl', 'rb') as f:
    stored_encodings = pickle.load(f)

# Function to compare the uploaded image with stored encodings
def match_face(image_path, stored_encodings, tolerance=0.6):
    img = cv2.imread(image_path)
    rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    face_encoding = face_recognition.face_encodings(rgb_img)
    
    if not face_encoding:
        return None
    
    face_encoding = face_encoding[0]
    
    for player_name, stored_encoding in stored_encodings.items():
        matches = face_recognition.compare_faces([stored_encoding], face_encoding, tolerance=tolerance)
        
        if matches[0]:
            return player_name

    return None

def format_player_name(player_name):
    return " ".join(part.upper() for part in player_name.split("_"))

# Define the directory structure for statistics files
base_dir = '../Statistics'
file_structure = {
    'Batting': {'ODI': 'ODI_data.csv', 'T20': 't20.csv', 'Test': 'test.csv'},
    'Bowling': {'ODI': 'Bowling_ODI.csv', 'T20': 'Bowling_t20.csv', 'Test': 'Bowling_test.csv'}
}

# Route to recognize the player from an uploaded image
@app.route('/recognize-player', methods=['POST'])
def recognize_player():
    if 'image' not in request.files:
        return jsonify({"message": "No image provided"}), 400
    
    image = request.files['image']
    image_path = 'uploaded_image.jpg'
    image.save(image_path)

    matched_player = match_face(image_path, stored_encodings)
    os.remove(image_path)  # Remove temporary image file

    if matched_player:
        formatted_name = format_player_name(matched_player)
        
        # Retrieve statistics for the matched player
        player_statistics = {}
        for category, formats in file_structure.items():
            player_statistics[category] = {}
            for format_name, filename in formats.items():
                file_path = os.path.join(base_dir, category, filename)
                
                if os.path.exists(file_path):
                    data = pd.read_csv(file_path)
                    
                    # Drop the last column if it contains NaN values
                    if data.columns[-1] == 'Unnamed: 0' or data.columns[-1].startswith('Unnamed'):
                        data = data.iloc[:, :-1]  # Drop the last column
                    
                    player_info = data[data['Player'] == matched_player]
                    # Check if data exists, otherwise provide a null value for empty fields
                    player_statistics[category][format_name] = (
                        player_info.to_dict(orient='records')[0] if not player_info.empty else "0"
                    )
                else:
                    player_statistics[category][format_name] = "0"

        return jsonify({
            "player_name": formatted_name,
            "statistics": player_statistics
        }), 200
    else:
        return jsonify({"message": "No match found"}), 404

if __name__ == '__main__':
    app.run(debug=True)