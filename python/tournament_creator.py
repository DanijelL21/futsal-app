from common import put_firebase_object, generate_next_id, create_firebase_user
import random
import string

name = "Local Legends Cup"
date = "04.06-08.06.2024"
image_uri = (
    "https://drive.google.com/file/d/1gNjOM88qH6DdVdVQUktpp6SvuFFHKpb3/view?usp=drive_link"
)
color = "blue"
match_length = 30
admin_mail = "locallegendscup@gmail.com"

def transform_image_link(link: str) -> str:
    start_index = link.find('/d/') + 3 
    end_index = link.find('/', start_index)  
    
    file_id = link[start_index:end_index]
    
    return f"https://drive.google.com/uc?export=view&id={file_id}"

def generate_password(length=6):
    characters = string.ascii_letters + string.digits
    
    password = ''.join(random.choice(characters) for _ in range(length))
    
    return password

def generate_tournament_data(
    name: str, date: str, image_uri: str, color: str, match_lenght: int, admin_mail: str
) -> dict:
    data = {
        name: {
            "id": generate_next_id("tournaments"),
            "tournamentName": name,
            "tournamentDate": date,
            "imageUri": transform_image_link(image_uri),
            "color": color,
            "matchLength": match_length,
            "adminMail": admin_mail,
        }
    }

    return data

data = generate_tournament_data(name, date, image_uri, color, match_length, admin_mail)
put_firebase_object("tournaments", data)

# create firebase user 
password = generate_password()
create_firebase_user(admin_mail, password)

print(f"Username: {admin_mail}, password: {password}")



