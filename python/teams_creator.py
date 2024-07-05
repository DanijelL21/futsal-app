from common import put_firebase_object, get_firebase_object, generate_next_id

tournament_name = "MNT SMRIKA"

path = f"{tournament_name}/teams"


def generate_teams_data(team_name: str, group: str, manager: str, players: list):
    data = {
        team_name: {
            "id": generate_next_id(path),
            "group": group,
            "manager": manager,
            "teamName": team_name,
            "players": players,
            "statistics": {
                "pg": 0, # played games
                "w": 0, # win
                "l": 0, # lose
                "d": 0, # draw
                "g": [0, 0], # goals []
                "gd": 0,
                "p": 0,
            },
        }
    }

    return data


# data = generate_teams_data(team_name, group, manager, players)
# put_firebase_object(path, data)

# create dummy data

groups = ["A", "B", "C", "D", "E", "F", "G", "H"]

for i in range(0, 3):
    for group in groups:
        team_name = f"test team {i}{group}"
        manager = f"test manager {i}{group}"
        players = [{"name": f"Test Player {k}{i}", "number": k} for k in range(0, 13)]
        data = generate_teams_data(team_name, group, manager, players)
        put_firebase_object(path, data)
