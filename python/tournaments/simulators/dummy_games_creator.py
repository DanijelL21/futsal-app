from datetime import datetime, timedelta

from python.common import generate_next_id, get_firebase_object, put_firebase_object

# tournamentName = "All-Star Futsal Fest"
# start_time = "10.01.2024 18:00"
# daily_match_nr = 8
# match_length = 30
# pause_lenght = 15


def generate_games_data(home: str, away: str, date: str, time: str, path: str):
    data = {
        home
        + away: {
            "id": generate_next_id(path),
            "home": home,
            "away": away,
            "date": date,
            "time": time,
        }
    }

    return data


def create_group_stage_games(
        tournament_info: dict, start_hour: str, daily_match_nr: int, pause_lenght: int
):
    path = f"{tournament_info["name"]}/games/Group Stage"
    teams = get_firebase_object(f"{tournament_info["name"]}/teams")
    matches = {}
    for team in teams.values():
        team_name = team["teamName"]
        group = team["group"]
        if group not in matches:
            matches[group] = []
        matches[group].append(team_name)

    matches_ct = 0

    start_datetime = datetime.strptime(f"{tournament_info["start_date"]} {start_hour}", "%d.%m.%Y %H:%M")
    start_hour = start_datetime.strftime("%H:%M")
    for group_teams in matches.values():
        for i in range(len(group_teams)):
            for j in range(i + 1, len(group_teams)):
                game_date = start_datetime.strftime("%d.%m.%Y")
                game_time = start_datetime.strftime("%H:%M")


                game = generate_games_data(
                    group_teams[i], group_teams[j], game_date, game_time, path
                )

                put_firebase_object(path, game)
                start_datetime += timedelta(minutes=tournament_info["match_length"] + pause_lenght)
                matches_ct += 1

                if matches_ct == daily_match_nr:
                    matches_ct = 0
                    if start_datetime.strftime("%H:%M") != "00:00":
                        start_datetime += timedelta(days=1)
                    start_datetime = datetime.strptime(
                        start_datetime.strftime("%d-%m-%Y") + " " + start_hour,
                        "%d-%m-%Y %H:%M",
                    )

    print("Succeesfully created dummy group stage")


def create_round_16_games(tournament_info: dict, start_hour: str, pause_lenght: int):
    teams = get_firebase_object(f"{tournament_info["name"]}/teams")
    path = f"{tournament_info["name"]}/games/Round of 16"
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
    sorted_groups = {}
    for group, teams in groups.items():
        sorted_groups[group] = sorted(teams, key=lambda x: x["points"], reverse=True)

    matchups = [
        ["A", "B"],
        ["C", "D"],
        ["E", "F"],
        ["G", "H"],
        ["B", "A"],
        ["D", "C"],
        ["F", "E"],
        ["H", "G"],
    ]

    start_datetime = datetime.strptime(f"{tournament_info['start_date']} {start_hour}", "%d.%m.%Y %H:%M") + timedelta(days=3)
    start_hour = start_datetime.strftime("%H:%M")
    for group1, group2 in matchups:
        if group1 in sorted_groups and group2 in sorted_groups:
            team1 = sorted_groups[group1][0] if len(sorted_groups[group1]) > 0 else None
            team2 = sorted_groups[group2][1] if len(sorted_groups[group2]) > 1 else None
            if team1 and team2:
                game_date = start_datetime.strftime("%d.%m.%Y")
                game_time = start_datetime.strftime("%H:%M")
                game = generate_games_data(
                    team1["team_name"], team2["team_name"], game_date, game_time, path
                )

                start_datetime += timedelta(minutes=tournament_info["match_length"] + pause_lenght)
                put_firebase_object(path, game)

    print("Succeesfully create dummy round of 16")

def create_other_games(tournament_info: dict, start_hour: str, pause_lenght: int, stage: str):

    phases = [
        "Group Stage",
        "Round of 16",
        "Quarter-finals",
        "Semi-finals",
        "Final"
    ]

    matches = get_firebase_object(f"{tournament_info["name"]}/games/{phases[phases.index(stage) - 1]}") # get from stage before
    games = dict(sorted(matches.items(), key=lambda x: datetime.strptime(x[1]['time'], '%H:%M')))

    dest_path = f"{tournament_info["name"]}/games/{stage}" # get this stage

    winning_teams = [game["home"] if game["score"][0] > game["score"][1] else game["away"] for game in games.values()]

    start_datetime = datetime.strptime(f"{tournament_info['start_date']} {start_hour}", "%d.%m.%Y %H:%M") + timedelta(days=4)

    if stage == "Final":
        losing_teams = [game["home"] if game["score"][1] > game["score"][0] else game["away"] for game in games.values()]
        game_date = start_datetime.strftime("%d.%m.%Y")
        game_time = start_datetime.strftime("%H:%M")

        game = generate_games_data(
            losing_teams[0], losing_teams[1], game_date, game_time, dest_path
        )

        game[f'{losing_teams[0]}{losing_teams[1]}']["matchType"] = "Third-place"
        start_datetime += timedelta(minutes=tournament_info["match_length"] + pause_lenght)

        put_firebase_object(dest_path, game)

    for i in range(0, len(winning_teams), 2):
        game_date = start_datetime.strftime("%d.%m.%Y")
        game_time = start_datetime.strftime("%H:%M")
        
        game = generate_games_data(
            winning_teams[i], winning_teams[i + 1], game_date, game_time, dest_path
        )

        if stage == "Final":
            game[f'{winning_teams[0]}{winning_teams[1]}']["matchType"] = "Final"
        start_datetime += timedelta(minutes=tournament_info["match_length"] + pause_lenght)

        put_firebase_object(dest_path, game)

    print(f"Succesfully created dummy {stage}")
