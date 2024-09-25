import random

from python.common import generate_next_id, put_firebase_object
from python.dummy_data import first_names, last_names


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
            "group": group,
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
    return data


def create_teams(tournamentName: str, team_names: list, nr_of_teams: int):
    path = f"{tournamentName}/teams"

    if nr_of_teams == 24:
        groups = ["A", "B", "C", "D", "E", "F", "G", "H"]
    else:
        groups = ["A", "B", "C", "D"]
        team_names = team_names[0:16]

    for i, team_name in enumerate(team_names):
        group = groups[i % len(groups)]
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


# tournamentName = "Final Test"
# team_names = ["Team 1", "Team 2", "Team 3"]
# path = f"{tournamentName}/teams"

# groups = ["A"]

# for i, team_name in enumerate(team_names):
#     group = groups[i % len(groups)]
#     manager = generate_random_name()
#     players = [
#         {
#             "name": generate_random_name(),
#             "number": str(k),
#             "club": team_name,
#             "stats": {"goals": 0, "assists": 0, "yc": 0, "rc": 0},
#         }
#         for k in range(1, 14)
#     ]
#     data = generate_teams_data(path, team_name, group, manager, players)
#     put_firebase_object(path, data)
