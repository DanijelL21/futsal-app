"""
Purpose of this file is to simulate whole tournament.
"""

# %%


import os

os.chdir("/Users/danijel/Desktop/app-prod/resources")

from python.dummy_data import team_names_24
from python.tournaments.simulators.dummy_games_creator import (
    create_group_stage_games,
    create_other_games,
    create_round_16_games,
)
from python.tournaments.simulators.dummy_score_simulator import (
    simulate_game_results,
)
from python.tournaments.simulators.dummy_teams_creator import create_teams
from python.tournaments.tournament_creator import create_tournament

tournament_info = {
    "name": "Futsal Fiesta",
    "mode": "tournaments",
    "start_date": "05.05.2025",
    "end_date": "05.10.2025",
    "image_uri": "https://drive.google.com/file/d/1gNjOM88qH6DdVdVQUktpp6SvuFFHKpb3/view?usp=drive_link",
    "color": "red",
    "match_length": 30,
    "nr_of_teams": 24,
    "admin_mail": "futsalfiesta@gmail.com",
}

# %% 1. Create tournament

create_tournament(tournament_info)

# %% 2. Create random teams

create_teams(tournament_info["name"], team_names, 24)

# %% 3. Generate group stage games

create_group_stage_games(
    tournament_info, start_hour="18:00", daily_match_nr=8, pause_lenght=15
)

# %% 4. Simulate score and events

simulate_game_results(tournament_info["name"], "Group Stage")

# %% 5. Generate round of 16 games

create_round_16_games(tournament_info, start_hour="18:00", pause_lenght=15)

# %% 6. Simulate score

simulate_game_results(tournament_info["name"], "Round of 16")

# %% 7. Generate round of 16 games

create_other_games(
    tournament_info,
    start_hour="18:00",
    pause_lenght=15,
    stage="Quarter-finals",
)

# %% 6. Simulate score

simulate_game_results(tournament_info["name"], "Quarter-finals")

# %% 8. Generate semi finals

create_other_games(
    tournament_info, start_hour="20:30", pause_lenght=15, stage="Semi-finals"
)

# %% 9. Simulate score

simulate_game_results(tournament_info["name"], "Semi-finals")

# %% 10. Generate finals

create_other_games(
    tournament_info, start_hour="21:30", pause_lenght=15, stage="Final"
)

# %% 11. Simulate score

simulate_game_results(tournament_info["name"], "Final")

# %%
