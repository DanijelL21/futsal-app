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

def create_firebase_user(email: str, password: str):
    try:
        user = auth.create_user(
            email=email,
            password=password
        )
        print(f"Successfully created new user: {user.uid}")
        return user
    except auth.EmailAlreadyExistsError:
        print("The email address is already in use.")
    except Exception as e:
        print(f"Error creating user: {e}")
