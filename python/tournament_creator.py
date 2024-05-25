from common import put_firebase_object, get_firebase_object

path = "tournaments"

name= "MNT ŠMRIKA"
date= "08.07-13.07.2024"
image_uri= "https://drive.google.com/uc?export=view&id=12jYhGPb1VIEDuPyB8ONTZ-lGDN0ScWuW"
color ="red"
admin_mail="mnthreljin@gmail.com"

def generate_next_id(path):
    data = get_firebase_object(path)

    ids = [data[key]['id'] for key in data] if data else [0]
    max_id = max(ids)
    return max_id+1

def generate_tournament_data(
    name: str, date: str, image_uri: str, color: str, admin_mail: str
):
    data = {name: {
        "id": generate_next_id("tournaments"),
        "name": name,
        "date": date,
        "imageUri":image_uri,
        "color": color,
        "adminMail": admin_mail
    }}

    return data 

data = generate_tournament_data(name, date, image_uri, color, admin_mail)
put_firebase_object(path, data)

## implementirat da mi sam generira ovaj image uri