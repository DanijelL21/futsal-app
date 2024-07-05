from common import put_firebase_object, generate_next_id, create_firebase_user

path = "tournaments"

name = "MNT DANILO"
date = "08.07-13.07.2024"
image_uri = (
    "https://drive.google.com/uc?export=view&id=12jYhGPb1VIEDuPyB8ONTZ-lGDN0ScWuW"
)
color = "blue"
match_lenght = 15
admin_mail = "mnthreljin@gmail.com"


def generate_tournament_data(
    name: str, date: str, image_uri: str, color: str, match_lenght: int, admin_mail: str
):
    data = {
        name: {
            "id": generate_next_id("tournaments"),
            "name": name,
            "date": date,
            "imageUri": image_uri,
            "color": color,
            "match_lenght": match_lenght,
            "adminMail": admin_mail,
        }
    }

    return data


data = generate_tournament_data(name, date, image_uri, color, match_lenght, admin_mail)
put_firebase_object(path, data)
create_firebase_user(admin_mail, "123456")

## implementirat da mi sam generira ovaj image uri
