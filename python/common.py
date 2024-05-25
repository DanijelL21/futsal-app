import firebase_admin
from firebase_admin import credentials
from firebase_admin import db


def _initialize_firebase_admin(
    database_url: str = "https://futsal-app-775db-default-rtdb.europe-west1.firebasedatabase.app/",
    secrets_file: str = "python/secret.json",
):
    try:
        cred = credentials.Certificate(secrets_file)
        firebase_admin.initialize_app(cred, {"databaseURL": database_url})
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
