import json
from firebase_admin import credentials, auth, db, initialize_app


def _initialize_firebase_admin(
    database_url: str = "https://futsal-app-775db-default-rtdb.europe-west1.firebasedatabase.app/",
    secrets_file: str = "python/secret.json",
):
    try:
        cred = credentials.Certificate(secrets_file)
        initialize_app(cred, {"databaseURL": database_url})
    except ValueError:
        pass
    except Exception as e:
        raise e


def put_firebase_object(
    file_path: str,
    data: dict,
):
    _initialize_firebase_admin()

    ref = db.reference(file_path)
    ref.update(data)


def get_firebase_object(
    file_path: str,
):

    _initialize_firebase_admin()

    ref = db.reference(file_path)
    data = ref.get()

    return data


def generate_next_id(path):
    data = get_firebase_object(path)
    ids = [data[key]["id"] for key in data] if data else [0]
    max_id = max(ids)
    return max_id + 1


def _store_user_data(tournament_info: dict, password: str) -> None:
    try:
        with open("python/users.json", "r") as file:
            data = json.load(file)
    except FileNotFoundError:
        data = {"tournaments": []}

    tournament_info["password"] = password
    data["tournaments"].append(tournament_info)

    with open("python/users.json", "w") as file:
        json.dump(data, file, indent=4)


def create_firebase_user(tournament_info: dict, password: str):
    try:
        user = auth.create_user(email=tournament_info["admin_mail"], password=password)
        print(f"Successfully created new user: {user.uid}")
        _store_user_data(tournament_info, password)
        return user
    except auth.EmailAlreadyExistsError:
        print("The email address is already in use.")
    except Exception as e:
        print(f"Error creating user: {e}")