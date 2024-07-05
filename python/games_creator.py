from common import put_firebase_object, get_firebase_object, generate_next_id
from datetime import datetime, timedelta


tournament_name = "MNT SMRIKA"
start_time = "10.01.2024 18:00"
daily_match_nr = 8
match_length = 30
pause_lenght = 15

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

def generate_groups(teams):
    groups = {}
    for team in teams.values():
        team_name = team["teamName"]
        group = team["group"]
        if group not in groups:
            groups[group] = []
        groups[group].append({"team_name": team_name, "points": team["statistics"]["p"], "id": team["id"]})
    
    return groups

def create_group_stage_games(
    start_time: str, daily_match_nr: int, match_length: int, pause_lenght: int
):
    path = f"{tournament_name}/games/Group Stage"
    teams = get_firebase_object(f"{tournament_name}/teams")
    matches = {}
    for team in teams.values():
        team_name = team["teamName"]
        group = team["group"]
        if group not in matches:
            matches[group] = []
        matches[group].append(team_name)

    matches_ct = 0
    start_datetime = datetime.strptime(start_time, "%d.%m.%Y %H:%M")
    start_hour = start_datetime.strftime("%H:%M")
    for group_teams in matches.values():
        for i in range(len(group_teams)):
            for j in range(i + 1, len(group_teams)):
                game_date = start_datetime.strftime("%d-%m-%Y")
                game_time = start_datetime.strftime("%H:%M")

                game = generate_games_data(
                    group_teams[i], group_teams[j], game_date, game_time, path
                )

                put_firebase_object(path, game)
                start_datetime += timedelta(minutes=match_length + pause_lenght)
                matches_ct += 1

                if matches_ct == daily_match_nr:
                    matches_ct = 0
                    if start_datetime.strftime("%H:%M") != '00:00':
                        start_datetime += timedelta(days=1)
                    start_datetime = datetime.strptime(start_datetime.strftime("%d-%m-%Y") + " " + start_hour, "%d-%m-%Y %H:%M")

    return start_datetime ## NOT TESTED !!

def create_round_16_games(start_time: str, match_length: int, pause_lenght: int):
    teams = get_firebase_object(f"{tournament_name}/teams")
    path = f"{tournament_name}/games/Round of 16"
    groups = {}
    for team in teams.values():
        team_name = team["teamName"]
        group = team["group"]
        if group not in groups:
            groups[group] = []
        groups[group].append({"team_name": team_name, "points": team["statistics"]["p"], "id": team["id"]})
    sorted_groups = {}
    for group, teams in groups.items():
        sorted_groups[group] = sorted(teams, key=lambda x: x['points'], reverse=True)
    
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

    start_datetime = datetime.strptime(start_time, "%d.%m.%Y %H:%M")
    for group1, group2 in matchups:
        if group1 in sorted_groups and group2 in sorted_groups:
            team1 = sorted_groups[group1][0] if len(sorted_groups[group1]) > 0 else None
            team2 = sorted_groups[group2][1] if len(sorted_groups[group2]) > 1 else None
            if team1 and team2:
                game_date = start_datetime.strftime("%d-%m-%Y")
                game_time = start_datetime.strftime("%H:%M")
                game = generate_games_data(
                     team1['team_name'], team2['team_name'], game_date, game_time, path
                )

                start_datetime += timedelta(minutes=match_length + pause_lenght)
                put_firebase_object(path, game)

def create_quarter_finals_games(start_time: str, match_length: int, pause_lenght: int):
    games = get_firebase_object(f"{tournament_name}/games/Round of 16")
    path = f"{tournament_name}/games/Quarter-finals"
    
    winning_teams =[]
    for team in games.values():
        winner = team['home'] if team['score'][0] > team['score'][1] else team['away']
        winning_teams.append(winner)

    start_datetime = datetime.strptime(start_time, "%d.%m.%Y %H:%M")
    for i in range(0, len(winning_teams),2):
        game_date = start_datetime.strftime("%d-%m-%Y")
        game_time = start_datetime.strftime("%H:%M")
        game = generate_games_data(
                winning_teams[i], winning_teams[i+1], game_date, game_time, path
        )
        start_datetime += timedelta(minutes=match_length + pause_lenght)
        put_firebase_object(path, game)

def create_semi_finals_games(start_time: str, match_length: int, pause_lenght: int):
    games = get_firebase_object(f"{tournament_name}/games/Quarter-finals")
    path = f"{tournament_name}/games/Semi-finals"
    
    winning_teams =[]
    for team in games.values():
        winner = team['home'] if team['score'][0] > team['score'][1] else team['away']
        winning_teams.append(winner)

    start_datetime = datetime.strptime(start_time, "%d.%m.%Y %H:%M")
    for i in range(0, len(winning_teams),2):
        game_date = start_datetime.strftime("%d-%m-%Y")
        game_time = start_datetime.strftime("%H:%M")
        game = generate_games_data(
                winning_teams[i], winning_teams[i+1], game_date, game_time, path
        )
        start_datetime += timedelta(minutes=match_length + pause_lenght)
        put_firebase_object(path, game)

def create_finals_games(start_time: str, match_length: int, pause_lenght: int):
    games = get_firebase_object(f"{tournament_name}/games/Semi-finals")
    path = f"{tournament_name}/games/Final"
    
    winning_teams = []
    losing_teams = []
    
    for game in games.values():
        if game['score'][0] > game['score'][1]:
            winning_teams.append(game['home'])
            losing_teams.append(game['away'])
        else:
            winning_teams.append(game['away'])
            losing_teams.append(game['home'])

    start_datetime = datetime.strptime(start_time, "%d.%m.%Y %H:%M")
    for i in range(0, len(winning_teams),2):
        game_date = start_datetime.strftime("%d-%m-%Y")
        game_time = start_datetime.strftime("%H:%M")
        game = generate_games_data(
                winning_teams[i], winning_teams[i+1], game_date, game_time, path
        )
        start_datetime += timedelta(minutes=match_length + pause_lenght)
        put_firebase_object(path, game)
    for i in range(0, len(losing_teams),2):
        game_date = start_datetime.strftime("%d-%m-%Y")
        game_time = start_datetime.strftime("%H:%M")
        game = generate_games_data(
                losing_teams[i], losing_teams[i+1], game_date, game_time, path
        )
        start_datetime += timedelta(minutes=match_length + pause_lenght)
        put_firebase_object(path, game)
    
create_group_stage_games(start_time, daily_match_nr, match_length, pause_lenght)
# create_round_16_games("13.01.2024 18:00", match_length, pause_lenght)
# create_quarter_finals_games("14.01.2024 18:00", match_length, pause_lenght)
# create_semi_finals_games("14.01.2024 18:00", match_length, pause_lenght)
# create_finals_games("14.01.2024 18:00", match_length, pause_lenght)

# from datetime import datetime, timedelta
# from enum import Enum

# class TournamentStage(Enum):
#     ROUND_OF_16 = "Round of 16"
#     QUARTER_FINALS = "Quarter-finals"
#     SEMI_FINALS = "Semi-finals"
#     FINAL = "Final"
#     THIRD_PLACE = "Third Place"

# # Mapping of current stage to the next stage
# NEXT_STAGE = {
#     TournamentStage.ROUND_OF_16: TournamentStage.QUARTER_FINALS,
#     TournamentStage.QUARTER_FINALS: TournamentStage.SEMI_FINALS,
#     TournamentStage.SEMI_FINALS: TournamentStage.FINAL,
#     TournamentStage.FINAL: None  # Final stage has no next stage
# }

# def create_games(teams, start_datetime, match_length, pause_length, path):
#     for i in range(0, len(teams), 2):
#         game_date = start_datetime.strftime("%d-%m-%Y")
#         game_time = start_datetime.strftime("%H:%M")
#         game = generate_games_data(teams[i], teams[i+1], game_date, game_time, path)
#         put_firebase_object(path, game)
#         start_datetime += timedelta(minutes=match_length + pause_length)
#     return start_datetime

# def create_next_round_games(current_stage: TournamentStage, start_time: str, match_length: int, pause_length: int):
#     current_round = current_stage.value
#     next_stage = NEXT_STAGE[current_stage]
    
#     if next_stage is None:
#         return
    
#     next_round = next_stage.value
#     games = get_firebase_object(f"{tournament_name}/games/{current_round}")
#     path = f"{tournament_name}/games/{next_round}"
    
#     winning_teams = []
#     losing_teams = []
    
#     for game in games.values():
#         if game['score'][0] > game['score'][1]:
#             winning_teams.append(game['home'])
#             losing_teams.append(game['away'])
#         else:
#             winning_teams.append(game['away'])
#             losing_teams.append(game['home'])

#     start_datetime = datetime.strptime(start_time, "%d.%m.%Y %H:%M")
#     start_datetime = create_games(winning_teams, start_datetime, match_length, pause_length, path)

#     if next_stage == TournamentStage.FINAL:
#         # Also create the 3rd place game
#         path_third_place = f"{tournament_name}/games/{TournamentStage.THIRD_PLACE.value}"
#         create_games(losing_teams, start_datetime, match_length, pause_length, path_third_place)

# # Example usage:
# create_next_round_games(TournamentStage.ROUND_OF_16, "17.06.2024 18:00", 90, 15)
# create_next_round_games(TournamentStage.QUARTER_FINALS, "20.06.2024 18:00", 90, 15)
# create_next_round_games(TournamentStage.SEMI_FINALS, "23.06.2024 18:00", 90, 15)
