# to generate secret file go to project settings -> Service accounts -> generate new private api key
# also change database url

import json
import os

from firebase_admin import auth, credentials, db, initialize_app

# old https://futsal-app-775db-default-rtdb.europe-west1.firebasedatabase.app/

base_dir = os.path.abspath(os.path.dirname(__file__))
secrets_file = os.path.join(base_dir, "secrets/secret.json")


def _initialize_firebase_admin(
    database_url: str = "https://futsalapp-c67e9-default-rtdb.europe-west1.firebasedatabase.app/",
    secrets_file: str = secrets_file,
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


def delete_firebase_object(file_path: str):
    _initialize_firebase_admin()

    ref = db.reference(file_path)
    ref.delete()


def generate_next_id(path):
    data = get_firebase_object(path)
    ids = [data[key]["id"] for key in data] if data else [0]
    max_id = max(ids)
    return max_id + 1


def transform_image_link(link: str) -> str:
    start_index = link.find("/d/") + 3
    end_index = link.find("/", start_index)

    file_id = link[start_index:end_index]

    return f"https://drive.google.com/uc?export=view&id={file_id}"


def _store_user_data(
    competition_info: dict, password: str, user_uid: str
) -> None:
    try:
        with open("secrets/users.json", "r") as file:
            data = json.load(file)
    except FileNotFoundError:
        data = {"tournaments": [], "leagues": []}

    competition_info["password"] = password
    competition_info["user_uid"] = user_uid
    data[competition_info["mode"]].append(competition_info)

    with open("secrets/users.json", "w") as file:
        json.dump(data, file, indent=4)


def create_firebase_user(competition_info: dict, password: str):
    _initialize_firebase_admin()
    try:
        user = auth.create_user(
            email=competition_info["admin_mail"], password=password
        )
        _store_user_data(competition_info, password, user.uid)
        print(f"Successfully created new user: {user.uid}")
        return True
    except auth.EmailAlreadyExistsError:
        print("The email address is already in use.")
        return False
    except Exception as e:
        print(f"Error creating user: {e}")
        return False


def delete_firebase_user(
    uid: str,
):
    """
    Delete a user from Firebase Authentication by their UID.
    """
    _initialize_firebase_admin()

    try:
        auth.delete_user(uid)
        print(f"Successfully deleted user with UID: {uid}")
    except auth.UserNotFoundError:
        print(f"No user found with UID: {uid}")
    except Exception as e:
        print(f"Error deleting user: {e}")
        raise
