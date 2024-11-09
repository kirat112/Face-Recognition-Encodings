import cv2
import face_recognition
import pickle
# import numpy as np
import pandas as pd
import os

# Load the face encodings from the pickle file
with open('face_encodings_single_img.pkl', 'rb') as f:
    stored_encodings = pickle.load(f)

# Function to compare the random image with stored encodings
def match_face(image_path, stored_encodings, tolerance=0.6):
    # Load the random image
    img = cv2.imread(image_path)
    rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Get the face encoding for the random image
    face_encoding = face_recognition.face_encodings(rgb_img)
    
    if not face_encoding:
        print("No face found in the image.")
        return None
    
    face_encoding = face_encoding[0]  # Get the first face encoding
    
    # Iterate over the stored encodings and compare
    for player_name, stored_encoding in stored_encodings.items():
        # Compare the encoding with stored encodings
        matches = face_recognition.compare_faces([stored_encoding], face_encoding, tolerance=tolerance)
        
        # If there's a match
        if matches[0]:
            return player_name  # Return the name of the matched player

    return None  # No match found

# Path to your random image for testing
random_image_path = '../testImages/bs.jpg'  # Replace with the path to your test image

# Call the match_face function
matched_player = match_face(random_image_path, stored_encodings)

# Saving the matched player name to upper case
def format_player_name(player_name):
    # Split the name by underscore, convert each part to uppercase, and join with a space
    formatted_name = " ".join(part.upper() for part in player_name.split("_"))
    return formatted_name

# Example usage
# player_name = "ben_stokes"
formatted_name = format_player_name(matched_player)
# print(formatted_name)  # Output: BEN STOKES


# Save the matched player name to a variable
if matched_player:
    print(f"Matched Player: {formatted_name}")
else:
    print("No match found.")

# Save the matched player name to a file for use in the next script
with open('matched_player_name.txt', 'w') as file:
    if matched_player:
        file.write(matched_player)
    else:
        file.write("No match")


# Display the player statistics


# Load the matched player name
with open('matched_player_name.txt', 'r') as file:
    matched_player_name = file.read().strip()

# Define the base directory for the statistics files
base_dir = '../Statistics'

# Define the structure of the files to be loaded
file_structure = {
    'Batting': {
        'ODI': 'ODI_data.csv',
        'T20': 't20.csv',
        'Test': 'test.csv'
    },
    'Bowling': {
        'ODI': 'Bowling_ODI.csv',
        'T20': 'Bowling_t20.csv',
        'Test': 'Bowling_test.csv'
    }
}

# Check if there's a matched player name
if matched_player_name == "No match":
    print("No player matched.")
else:
    player_statistics = {}
    
    # Loop through the file structure to load each CSV
    for category, formats in file_structure.items():
        player_statistics[category] = {}
        
        for format_name, filename in formats.items():
            file_path = os.path.join(base_dir, category, filename)
            
            # Check if file exists before trying to read
            if os.path.exists(file_path):
                data = pd.read_csv(file_path)
                
                # Filter data for the matched player
                player_info = data[data['Player'] == matched_player_name]
                
                if not player_info.empty:
                    # Add player statistics for this category and format
                    player_statistics[category][format_name] = player_info.to_dict(orient='records')[0]
                else:
                    player_statistics[category][format_name] = "No data found for this player."
            else:
                player_statistics[category][format_name] = "File not found."

    # Display all player statistics
    print(f"Statistics for player: {formatted_name}")
    for category, formats in player_statistics.items():
        print(f"\n{category} Statistics:")
        for format_name, stats in formats.items():
            print(f"\n{format_name} Format:")
            if isinstance(stats, dict):
                for stat, value in stats.items():
                    print(f"{stat}: {value}")
            else:
                print(stats)
