from common import generate_next_id, put_firebase_object

news = {
    "title": "Futsal App is livee!",
    "image": "https://www.spized.com/media/c3/ea/11/1670592476/was-ist-futsal.jpg",
    "titleColor": "white",
}


def create_news(news):

    with open("news.md", "r") as file:
        content = file.read()
    news["content"] = content
    news["id"] = generate_next_id("news")

    return {news["title"]: news}


put_firebase_object("news", create_news(news))
