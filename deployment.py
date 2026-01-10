import os
import datetime
from jinja2 import Environment, FileSystemLoader
import mistune
import yaml

POSTS = []
ENV = Environment(loader=FileSystemLoader("templates"))

def get_posts():
    # Ensure that the global variable is used to avoid doing this multiple times
    global POSTS

    # Walk the entire directory
    for root, dirs, files in os.walk("blog/"):
        for file in files:
            # Construct the path of the file as the root directory and filename
            path = os.path.join(root, file)

            # Get the modification date of the file
            mtime = datetime.datetime.fromtimestamp(os.path.getctime(path))

            # Append the post (and its attributes) to the list of posts
            POSTS.append({"filename": file, "path": path, "mtime": mtime})

    # Sort the posts by their modification date (newest first)
    POSTS.sort(key = lambda x: x["mtime"], reverse=True)


def render_homepage():
    global ENV
    print("The homepage is now being created.")

    # Get the homepage template and render it
    homepage = ENV.get_template("homepage.html")
    output = homepage.render(posts=POSTS)

    # Write the render to the index.html file
    with open("public/index.html", "w") as file:
        file.write(output)

    print("The homepage has successfully been created.")


def render_posts():
    global ENV
    markdown = mistune.create_markdown(plugins=['strikethrough', 'footnotes', 'table', 'url', 'task_lists', 'abbr', 'mark', 'insert', 'superscript', 'subscript', 'math', 'spoiler'], escape=False, hard_wrap=True)

    # Store the post template in memory
    post_template = ENV.get_template("post.html")

    # Render every post
    for post in POSTS:
        print(f"The post located at {post["path"]} is now being created.")

        # Read the contents of the post
        with open(post["path"], "r") as file:
            content = file.read()

        # Load the frontmatter and content of the post
        frontmatter, content = [x for x in content.split("---", 2) if x != ""]
        frontmatter = yaml.safe_load(frontmatter)

        # Add the frontmatter attributes to the post's state
        post["meta"] = frontmatter
        post["content"] = markdown(content)

        # If the post has an empty updated field, ignore it
        if post["meta"]["updated"] == "": del post["meta"]["updated"]

        # Render the post using the template
        output = post_template.render(post=post)

        # Create the path of the output render and make the directory
        path = os.path.join("public", "blog", f"{post["meta"]["created"].year:02}", f"{post["meta"]["created"].month:02}", f"{post["meta"]["created"].day:02}")
        os.makedirs(path, exist_ok=True)

        # Write the render to a file
        with open(f"{os.path.join(path, post["meta"]["slug"])}.html", "w") as file:
            file.write(output)
        
        print(f"The page for the post {post["meta"]["title"]} has successfully been created.")


if __name__ == '__main__':
    get_posts()
    render_posts()
    render_homepage()