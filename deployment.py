import os
import datetime
from jinja2 import Environment, FileSystemLoader

POSTS = []

def get_posts():
    global POSTS
    for root, dirs, files in os.walk("blog/"):
        for file in files:
            POSTS.append(f'{root}{file}')

def render_homepage():
    env = Environment(loader=FileSystemLoader("templates"))
    base = env.get_template("base.html")
    homepage = env.get_template("_homepage.html")
    output = base.render(title="saacutter.github.io", body = homepage.render(posts = POSTS))

    with open("public/index.html", "w") as file:
        file.write(output)

    print("The homepage has successfully been created.")

def render_post():
    env = Environment(loader=FileSystemLoader("templates"))
    base = env.get_template("base.html")

if __name__ == '__main__':
    get_posts()
    render_homepage()