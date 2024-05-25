from common import put_firebase_object, get_firebase_object

tournament_name = "MNT SMRIKA"
group = "A"
manager = "Ana logicno"
team_name = "Ana team"
players = [{'name': 'Ana', 'number': '1'}]

path = f"{tournament_name}/teams"

def generate_next_id(path):
    data = get_firebase_object(path)

    ids = [data[key]['id'] for key in data] if data else [0]
    max_id = max(ids)
    return max_id+1

def generate_teams_data(
    team_name: str, group: str, manager: str, players: list
):
    data = {team_name: {
        "id": generate_next_id(path),
        "group": group,
        "manager": manager,
        "teamName": team_name,
        "players": players
    }}

    return data 

# data = generate_teams_data(team_name, group, manager, players)
# put_firebase_object(path, data)

# create dummy data

groups = ["A", "B", "C", "D", "E", "F", "G", "H"]

for i in range(0,3):
    for group in groups:
        team_name = f'test team {i}{group}'
        manager = f'test manager {i}{group}'
        players = [{'name': f'Test Player {k}{i}', 'number': k} for k in range(0, 13)]
        data = generate_teams_data(team_name, group, manager, players)
        put_firebase_object(path, data)