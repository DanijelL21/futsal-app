import json

from common import delete_firebase_object, delete_firebase_user

competition_name = "New League"
mode = "leagues"


def get_uid(competition_name, mode):
    with open("secrets/users.json", "r") as file:
        data = json.load(file)

    removed_user_uid = None

    for competition in data[mode]:
        if competition["name"] == competition_name:
            removed_user_uid = competition.get("user_uid")
            data[mode].remove(competition)
            break

    with open("secrets/users.json", "w") as file:
        json.dump(data, file, indent=4)

    return removed_user_uid


# DELETE FROM FIREBASE
delete_firebase_object(f"{mode}/{competition_name}")
delete_firebase_object(competition_name)

# DELETE USER FROM users.json and GET UID
uid = get_uid(competition_name, mode)

# DELETE USER FROM FIREBASE
if uid != None:
    delete_firebase_user(uid)
