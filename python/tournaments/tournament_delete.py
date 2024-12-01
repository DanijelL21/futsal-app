"""
Don't use this file directly. Use dummy_tournament_simulator.py
"""

import json

from python.common import delete_firebase_object, delete_firebase_user

tournament_name = "Dummy"


def get_uid(tournament_name):
    with open("secrets/users.json", "r") as file:
        data = json.load(file)

    removed_user_uid = None

    for tournament in data["tournaments"]:
        if tournament["name"] == tournament_name:
            removed_user_uid = tournament.get("user_uid")
            data["tournaments"].remove(tournament)
            break

    with open("secrets/users.json", "w") as file:
        json.dump(data, file, indent=4)

    return removed_user_uid


# DELETE FROM FIREBASE IN TOURNAMENTS
delete_firebase_object(f"tournaments/{tournament_name}")

# DELETE USER FROM users.json and GET UID
uid = get_uid(tournament_name)

# DELETE USER FROM FIREBASE
if uid != None:
    delete_firebase_user(uid)
