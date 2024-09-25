import random
import string
import sys

from common import create_firebase_user, generate_next_id, put_firebase_object

mode = "leagues"

competition_info = {
            "name": "New League",
            "mode":  "leagues",
            "start_date" : "2024-06-04",
            "end_date": "2024-06-08",
            "image_uri": "https://drive.google.com/file/d/1UnowdurwZcz758n3wAEYiWlC7DYwtGLi/view?usp=sharing",
            "color": "blue",
            "match_length": 30,
            "nr_of_teams": 24,
            "admin_mail": "leaguetest@gmail.com",
        }

# RUN python3 -m tournaments.tournament_creator

def transform_image_link(link: str) -> str:
    start_index = link.find('/d/') + 3 
    end_index = link.find('/', start_index)  
    
    file_id = link[start_index:end_index]
    
    return f"https://drive.google.com/uc?export=view&id={file_id}"

def generate_password(length=6):
    characters = string.ascii_letters + string.digits
    
    password = ''.join(random.choice(characters) for _ in range(length))
    
    return password

def generate_data(
    competition_info: dict,
) -> dict:
    data = {
        competition_info["name"]: {
            "id": generate_next_id(competition_info["mode"]),
            "tournamentName": competition_info["name"], # WE SHOULD CHANGE THIS IN WHOLE CODE. FOR NOW LEAVE THIS
            "mode": competition_info["mode"],
            "startDate": competition_info["start_date"],
            "endDate": competition_info["end_date"],
            "imageUri": transform_image_link(competition_info["image_uri"]),
            "color": competition_info["color"],
            "matchLength": competition_info["match_length"],
            "teamsNr": competition_info["nr_of_teams"],
            "adminMail": competition_info["admin_mail"],
        }
    }

    return data

def create_competition(competition_info: dict) -> None:
    # create firebase user 
    password = generate_password()
    d = create_firebase_user(competition_info, password)

    if not d:
        sys.exit(1)
        
    data = generate_data(competition_info)
    put_firebase_object(competition_info["mode"], data)

    print(f"Succeesfully created {competition_info["mode"]} {competition_info["name"]}")

create_competition(competition_info)
