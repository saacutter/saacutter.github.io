import os
import datetime
from jinja2 import Environment, FileSystemLoader

POSTS = []
ENV = Environment(loader=FileSystemLoader("templates"))

def get_posts():
    # Ensure that the global variable is used to avoid doing this multiple times
    global POSTS

    # Walk the entire directory
    for root, dirs, files in os.walk("blog/"):
        for file in files:
            path = f'{root}{file}'
            mtime = datetime.datetime.fromtimestamp(os.path.getctime(path))
            POSTS.append({"title": file.replace(".md", ""), "path": path, "mtime": mtime})

    # Sort the posts by their modification date (newest first)
    POSTS.sort(key = lambda x: x["mtime"], reverse=True)


def render_homepage():
    global ENV

    # Get the homepage template and render it
    homepage = ENV.get_template("homepage.html")
    output = homepage.render(posts=POSTS)

    # Write the render to the index.html file
    with open("public/index.html", "w") as file:
        file.write(output)

    print("The homepage has successfully been created.")


def render_posts():
    global ENV

    # Store the post template in memory
    post_template = ENV.get_template("post.html")

    # Render every post
    for post in POSTS:
        # Render the post using the template
        output = post_template.render(post=post)

        # Create the path of the output render and make the directory
        path = os.path.join("public", "blog", f"{post["mtime"].year:02}", f"{post["mtime"].month:02}", f"{post["mtime"].day:02}")
        os.makedirs(path, exist_ok=True)

        # Write the render to a file
        with open(f"{os.path.join(path, post["title"])}.html", "w") as file:
            file.write(output)
        
        print(f"The page for the post {post["title"]} has successfully been created.")


if __name__ == '__main__':
    get_posts()
    render_homepage()
    render_posts()