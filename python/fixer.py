from common import get_firebase_object


def fix_games(path):
    obj = get_firebase_object(path)

    id_to_keys = {}
    for key, match in obj.items():
        match_id = match["id"]
        if match_id in id_to_keys:
            id_to_keys[match_id].append(key)
        else:
            id_to_keys[match_id] = [key]

    duplicate_keys = {id: keys for id, keys in id_to_keys.items() if len(keys) > 1}

    return duplicate_keys


tournament_name = "MNT SMRIKA"
problematic_stage = "Group Stage"
path = f"{tournament_name}/games/{problematic_stage}"

print(fix_games(path))
