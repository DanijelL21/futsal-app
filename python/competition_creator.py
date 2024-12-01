import random
import string
import sys

from common import (
    create_firebase_user,
    generate_next_id,
    put_firebase_object,
    transform_image_link,
)

mode = "leagues"


competition_info = {
    "name": "Futsal Fiesta",
    "mode": "tournaments",
    "start_date": "2025-05-05",
    "end_date": "2025-05-10",
    "image_uri": "https://drive.google.com/file/d/1gNjOM88qH6DdVdVQUktpp6SvuFFHKpb3/view?usp=drive_link",
    "color": "red",
    "match_length": 30,
    "nr_of_teams": 24,
    "admin_mail": "futsalfei@gmail.com",
}

# RUN python3 -m tournaments.tournament_creator


def generate_password(length=6):
    characters = string.ascii_letters + string.digits

    password = "".join(random.choice(characters) for _ in range(length))

    return password


def generate_data(
    competition_info: dict,
) -> dict:
    data = {
        competition_info["name"]: {
            "id": generate_next_id(competition_info["mode"]),
            "competitionName": competition_info["name"],
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

    print(
        f"Succeesfully created {competition_info["mode"]} {competition_info["name"]}"
    )


create_competition(competition_info)
