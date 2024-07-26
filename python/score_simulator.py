from common import put_firebase_object, get_firebase_object
import random

tournamentName = "MNT SMRIKA"


def generate_groups(teams):
    groups = {}
    for team in teams.values():
        team_name = team["teamName"]
        group = team["group"]
        if group not in groups:
            groups[group] = []
        groups[group].append(
            {
                "team_name": team_name,
                "points": team["statistics"]["p"],
                "id": team["id"],
            }
        )

    return groups


def simulate_group_stage_score(tournamentName):
    stage = "Group Stage"
    teams_dict = get_firebase_object(f"{tournamentName}/teams")
    sorted_teams = generate_groups(teams_dict)

    for teams_list in sorted_teams.values():
        ct = 2
        for team in teams_list:
            put_firebase_object(
                f"{tournamentName}/teams/{team['team_name']}",
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
                },
            )

            ct -= 1

            if ct == -1:
                ct = 2

    games_dict = get_firebase_object(f"{tournamentName}/games/{stage}")
    for game_key in games_dict.keys():
        put_firebase_object(
            f"{tournamentName}/games/{stage}/{game_key}", {"score": [0, 1]}
        )


def simulate_other_scores(tournamentName, stage):
    games_dict = get_firebase_object(f"{tournamentName}/games/{stage}")
    for game_key in games_dict.keys():
        home_score = random.randint(0, 9)
        away_score = random.randint(0, 9)

        # for now, till I determine how to handle draws
        while home_score == away_score:
            home_score = random.randint(0, 9)
            away_score = random.randint(0, 9)

        put_firebase_object(
            f"{tournamentName}/games/{stage}/{game_key}",
            {"score": [home_score, away_score]},
        )


# simulate_group_stage_score(tournamentName)
# simulate_other_scores(tournamentName, "Round of 16")
# simulate_other_scores(tournamentName, "Quarter-finals")
simulate_other_scores(tournamentName, "Semi-finals")
