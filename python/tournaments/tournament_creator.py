"""
Don't use this file directly. Use dummy_tournament_simulator.py
"""

import random
import string
import sys

from python.common import (
    create_firebase_user,
    generate_next_id,
    put_firebase_object,
)

tournament_info = {
    "name": "Dummy",
    "start_date": "2024-06-04",
    "end_date": "2024-06-08",
    "image_uri": "https://drive.google.com/file/d/1UnowdurwZcz758n3wAEYiWlC7DYwtGLi/view?usp=sharing",
    "color": "blue",
    "match_length": 30,
    "nr_of_teams": 24,
    "admin_mail": "dummy@gmail.com",
}

# RUN python3 -m tournaments.tournament_creator


def transform_image_link(link: str) -> str:
    start_index = link.find("/d/") + 3
    end_index = link.find("/", start_index)

    file_id = link[start_index:end_index]

    return f"https://drive.google.com/uc?export=view&id={file_id}"


def generate_password(length=6):
    characters = string.ascii_letters + string.digits

    password = "".join(random.choice(characters) for _ in range(length))

    return password


def generate_tournament_data(tournament_info: dict) -> dict:
    data = {
        tournament_info["name"]: {
            "id": generate_next_id("tournaments"),
            "tournamentName": tournament_info["name"],
            "startDate": tournament_info["start_date"],
            "endDate": tournament_info["end_date"],
            "imageUri": transform_image_link(tournament_info["image_uri"]),
            "color": tournament_info["color"],
            "matchLength": tournament_info["match_length"],
            "teamsNr": tournament_info["nr_of_teams"],
            "adminMail": tournament_info["admin_mail"],
        }
    }

    return data


def create_tournament(
    tournament_info: dict,
) -> None:
    # create firebase user
    password = generate_password()
    d = create_firebase_user(tournament_info, password)

    if not d:
        sys.exit(1)

    data = generate_tournament_data(tournament_info)
    put_firebase_object("tournaments", data)

    print(f"Succeesfully created tournament {tournament_info["name"]}")
