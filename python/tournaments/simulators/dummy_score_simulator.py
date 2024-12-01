"""
Don't use this file directly. Use dummy_tournament_simulator.py
"""

import random

from python.common import get_firebase_object, put_firebase_object


def generate_team_statistics(
    updated_home_team, updated_away_team, events_list, tournament_phase, score
):
    for event in events_list:
        event_type = event.get("event")
        player = event.get("player")
        assist = event.get("assist")
        team = event.get("team")

        team_data = updated_home_team if team == "home" else updated_away_team

        player_data = next(
            (p for p in team_data["players"] if p["name"] == player), None
        )

        if player_data:
            if event_type == "goal":
                player_data["stats"]["goals"] = (
                    player_data["stats"].get("goals", 0) + 1
                )
            elif event_type == "assist":
                player_data["stats"]["assists"] = (
                    player_data["stats"].get("assists", 0) + 1
                )
            elif event_type == "redCard":
                player_data["stats"]["rc"] = (
                    player_data["stats"].get("rc", 0) + 1
                )
            elif event_type == "yellowCard":
                player_data["stats"]["yc"] = (
                    player_data["stats"].get("yc", 0) + 1
                )

        if event_type == "goal" and assist and assist != "NONE":
            assist_player_data = next(
                (p for p in team_data["players"] if p["name"] == assist), None
            )
            if assist_player_data:
                assist_player_data["stats"]["assists"] = (
                    assist_player_data["stats"].get("assists", 0) + 1
                )

    if tournament_phase == "Group Stage":
        home_score, away_score = score

        # Update home team statistics
        updated_home_team["statistics"]["pg"] += 1
        updated_home_team["statistics"]["w"] += (
            1 if home_score > away_score else 0
        )
        updated_home_team["statistics"]["l"] += (
            1 if away_score > home_score else 0
        )
        updated_home_team["statistics"]["d"] += (
            1 if home_score == away_score else 0
        )
        updated_home_team["statistics"]["g"][0] += home_score
        updated_home_team["statistics"]["g"][1] += away_score
        updated_home_team["statistics"]["gd"] += home_score - away_score

        # Update away team statistics
        updated_away_team["statistics"]["pg"] += 1
        updated_away_team["statistics"]["w"] += (
            1 if away_score > home_score else 0
        )
        updated_away_team["statistics"]["l"] += (
            1 if home_score > away_score else 0
        )
        updated_away_team["statistics"]["d"] += (
            1 if home_score == away_score else 0
        )
        updated_away_team["statistics"]["g"][0] += away_score
        updated_away_team["statistics"]["g"][1] += home_score
        updated_away_team["statistics"]["gd"] += away_score - home_score

        # Update points
        updated_home_team["statistics"]["p"] += (
            3
            if home_score > away_score
            else (1 if home_score == away_score else 0)
        )
        updated_away_team["statistics"]["p"] += (
            3
            if away_score > home_score
            else (1 if home_score == away_score else 0)
        )

    return updated_home_team, updated_away_team


def generate_groups(teams):
    """
    EX {'D': [{'team_name': 'Bears Club', 'points': 0, 'id': 12}],
    'C': [{'team_name': 'Bulls Team', 'points': 0, 'id': 19}...}
    """
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


def generate_random_event(teams_dict, match):
    """Generate a random event and assign random player(s) from the team."""
    random_event = random.choice(["goal", "goal", "redCard", "yellowCard"])
    team = random.choice(["home", "away"])
    player = teams_dict[match[team]]["players"][random.randint(1, 12)]["name"]

    event = {
        "event": random_event,
        "player": player,
        "team": team,
        "time": random.randint(1, 29),
    }

    if random_event == "goal":
        event["assist"] = teams_dict[match[team]]["players"][
            random.randint(1, 12)
        ]["name"]

    return event


def simulate_game_results(tournamentName, stage):
    teams_dict = get_firebase_object(f"{tournamentName}/teams")

    # if stage == "Group Stage":
    #     sorted_teams = generate_groups(teams_dict)

    #     matches = []
    #     for teams in sorted_teams.values():
    #         matches.extend(
    #             [
    #                 {"home": home["team_name"], "away": away["team_name"]}
    #                 for home, away in itertools.combinations(teams, 2)
    #             ]
    #         )
    #     print("MATCHES", matches)
    #     games = get_firebase_object(f"{tournamentName}/games/{stage}")
    #     matches = games.values()
    # else:
    #     games = get_firebase_object(f"{tournamentName}/games/{stage}")
    #     matches = games.values()
    games = get_firebase_object(f"{tournamentName}/games/{stage}")

    for game_key, match in games.items():
        print(match)
        home_team = match["home"]
        away_team = match["away"]
        # game_key = f"{home_team}{away_team}"

        nr_of_events = random.randint(1, 12)

        events = []
        score = [0, 0]

        put_firebase_object(
            f"{tournamentName}/events/{game_key}/time/end", {"time": 30}
        )
        for event_nr in range(nr_of_events):
            event = generate_random_event(teams_dict, match)

            if event["event"] == "goal":
                if event["team"] == "home":
                    score[0] += 1
                else:
                    score[1] += 1

            # put event

            put_firebase_object(
                f"{tournamentName}/events/{game_key}/{f"e_{event_nr}"}", event
            )

            events.append(event)

        # further stages must not finish draw
        if stage != "Group Stage" and score[0] == score[1]:
            score[0] += 1
            put_firebase_object(
                f"{tournamentName}/events/{game_key}/{f"e_draw_settler"}",
                {
                    "event": "goal",
                    "player": teams_dict[home_team]["players"][
                        random.randint(1, 12)
                    ]["name"],
                    "team": "home",
                    "time": 29,
                },
            )

        updated_home_team, updated_away_team = generate_team_statistics(
            teams_dict[home_team], teams_dict[away_team], events, stage, score
        )

        # PUT EVENTS

        # update score
        put_firebase_object(
            f"{tournamentName}/games/{stage}/{game_key}", {"score": score}
        )
        # update team stats
        put_firebase_object(
            f"{tournamentName}/teams/{home_team}", updated_home_team
        )

        # update team stats
        put_firebase_object(
            f"{tournamentName}/teams/{away_team}", updated_away_team
        )

        teams_dict[home_team] = updated_home_team
        teams_dict[away_team] = updated_away_team

    print(f"Succesfully simulated {stage}")


# simulate_game_results("Final Test", "Group Stage")
