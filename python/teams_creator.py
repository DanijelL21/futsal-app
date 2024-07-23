import random
from common import put_firebase_object, generate_next_id

tournamentName = "MNT SMRIKA"

path = f"{tournamentName}/teams"

first_names = [
    "John", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Christopher", "Daniel",
    "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua", "Kenneth", "Kevin",
    "Brian", "George", "Edward", "Ronald", "Timothy", "Jason", "Jeffrey", "Ryan", "Jacob", "Gary",
    "Nicholas", "Eric", "Stephen", "Jonathan", "Larry", "Justin", "Scott", "Brandon", "Benjamin", "Samuel",
    "Gregory", "Frank", "Alexander", "Raymond", "Patrick", "Jack", "Dennis", "Jerry", "Tyler", "Aaron",
    "Jose", "Henry", "Adam", "Douglas", "Nathan", "Peter", "Zachary", "Kyle", "Walter", "Harold"
]

last_names = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
    "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes"
]

team_names = [
    "Falcons United", "Eagles FC", "Lions Club", "Tigers SC", "Wolves Academy", "Panthers XI", "Sharks FC", "Dolphins",
    "Hawks Team", "Dragons Squad", "Raptors FC", "Bears Club", "Pumas United", "Leopards SC", "Cougars Academy",
    "Jaguars XI", "Cheetahs FC", "Rams Club", "Bulls Team", "Stallions SC", "Mustangs Academy", "Tornadoes XI",
    "Cyclones FC", "Stormers Club"
]

def generate_random_name():
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    return f"{first_name} {last_name}"

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

groups = ["A", "B", "C", "D", "E", "F", "G", "H"]

for i, team_name in enumerate(team_names):
    group = groups[i % len(groups)]  
    manager = generate_random_name()
    players = [{"name": generate_random_name(), "number": k} for k in range(1, 14)]
    data = generate_teams_data(team_name, group, manager, players)
    put_firebase_object(path, data)
