from common import put_firebase_object, get_firebase_object
import random

tournament_name = "MNT SMRIKA"

def simulate_group_stage_score(tournament_name):
    stage = "Group Stage"
    teams_dict = get_firebase_object(f"{tournament_name}/teams")

    ct = 2
    for team_key in teams_dict.keys():
        put_firebase_object(
            f"{tournament_name}/teams/{team_key}",
            {
            "statistics": {
                    "pg": 2, 
                    "w": ct, 
                    "l": 2 - ct, 
                    "d": 0, 
                    "g": [0, 0], 
                    "gd": 0,
                    "p": ct * 3,
                }
        })

        ct -= 1

        if ct == -1:
            ct = 2

    games_dict = get_firebase_object(f"{tournament_name}/games/{stage}")
    for game_key in games_dict.keys():
        put_firebase_object(
            f"{tournament_name}/games/{stage}/{game_key}",
            {"score": [0,1]})

def simulate_other_scores(tournament_name, stage):
    games_dict = get_firebase_object(f"{tournament_name}/games/{stage}")
    for game_key in games_dict.keys():
        home_score = random.randint(0, 9)
        away_score = random.randint(0, 9)
        
        # for now, till I determine how to handle draws
        while home_score == away_score:
            home_score = random.randint(0, 9)
            away_score = random.randint(0, 9)

        put_firebase_object(
            f"{tournament_name}/games/{stage}/{game_key}",
            {"score": [home_score,away_score]})
        
# simulate_group_stage_score(tournament_name)
# simulate_other_scores(tournament_name, "Round of 16")
simulate_other_scores(tournament_name, "Quarter-finals")
# simulate_other_scores(tournament_name, "Semi-finals")