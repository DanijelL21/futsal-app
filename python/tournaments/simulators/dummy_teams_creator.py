"""
Don't use this file directly. Use dummy_tournament_simulator.py
"""

import random

from common import generate_next_id, put_firebase_object
from dummy_data import first_names, last_names, team_names_24

competition_info = {
    "name": "Futsal Fiesta",
    "mode": "tournaments",
    "start_date": "2025-05-05",
    "end_date": "2025-05-10",
    "image_uri": "https://drive.google.com/file/d/1gNjOM88qH6DdVdVQUktpp6SvuFFHKpb3/view?usp=drive_link",
    "color": "red",
    "match_length": 30,
    "nr_of_teams": 24,
    "admin_mail": "futsalfiesta@gmail.com",
}


def generate_random_name():
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    return f"{first_name} {last_name}"


def generate_teams_data(
    path: str, team_name: str, group: str, manager: str, players: list
):
    data = {
        team_name: {
            "id": generate_next_id(path),
            "manager": manager,
            "teamName": team_name,
            "players": players,
            "statistics": {
                "pg": 0,  # played games
                "w": 0,  # win
                "l": 0,  # lose
                "d": 0,  # draw
                "g": [0, 0],  # goals []
                "gd": 0,
                "p": 0,
            },
        }
    }

    # Conditionally add 'group' key only if group is non-empty
    if group:
        data[team_name]["group"] = group

    return data


def create_teams(competition_info, team_names: list):
    path = f"{competition_info["name"]}/teams"

    ## for torunaments
    if competition_info["nr_of_teams"] == 24:
        groups = ["A", "B", "C", "D", "E", "F", "G", "H"]
    else:
        groups = ["A", "B", "C", "D"]
        team_names = team_names[0:16]

    for i, team_name in enumerate(team_names):
        if competition_info["mode"] == "tournaments":
            group = groups[i % len(groups)]
        else:
            group = []
        manager = generate_random_name()
        players = [
            {
                "name": generate_random_name(),
                "number": str(k),
                "club": team_name,
                "stats": {"goals": 0, "assists": 0, "yc": 0, "rc": 0},
            }
            for k in range(1, 14)
        ]
        data = generate_teams_data(path, team_name, group, manager, players)
        put_firebase_object(path, data)

    print("Succeesfully created dummy teams")


# create_teams(competition_info, team_names_24)
