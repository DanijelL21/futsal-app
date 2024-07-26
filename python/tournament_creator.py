from common import put_firebase_object, generate_next_id, create_firebase_user
import random
import string

tournament_info = {
            "name": "Local Legends Cup",
            "start_date" : "2024-06-04",
            "end_date": "2024-06-08",
            "image_uri": "https://drive.google.com/file/d/1gNjOM88qH6DdVdVQUktpp6SvuFFHKpb3/view?usp=drive_link",
            "color": "blue",
            "match_length": 30,
            "admin_mail": "locallegendscup@gmail.com",
        }

def transform_image_link(link: str) -> str:
    start_index = link.find('/d/') + 3 
    end_index = link.find('/', start_index)  
    
    file_id = link[start_index:end_index]
    
    return f"https://drive.google.com/uc?export=view&id={file_id}"

def generate_password(length=6):
    characters = string.ascii_letters + string.digits
    
    password = ''.join(random.choice(characters) for _ in range(length))
    
    return password

def generate_tournament_data(
    tournament_info: dict
) -> dict:
    data = {
        tournament_info["name"]: {
            "id": generate_next_id("tournaments"),
            "tournamentName": tournament_info["name"],
            "startDate": tournament_info["start_date"],
            "endDate": tournament_info["end_date"],
            "imageUri": transform_image_link(tournament_info["image_uri"]),
            "color": tournament_info["color"],
            "matchLength": tournament_info["match_length"],
            "adminMail": tournament_info["admin_mail"],
        }
    }

    return data

data = generate_tournament_data(tournament_info)
put_firebase_object("tournaments", data)

# create firebase user 
password = generate_password()
create_firebase_user(tournament_info, password)