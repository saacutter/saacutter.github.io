import os
import datetime
from jinja2 import Environment, FileSystemLoader
import mistune
import yaml
import hashlib
import shutil

POSTS = []
ENV = Environment(loader=FileSystemLoader("templates"))
ENV.globals['datetime'] = datetime # Make the datetime module available to templates
ENV.globals['posts'] = POSTS # Make posts available to templates globally

def update_posts():
    global POSTS # Ensure that the global variable is used to avoid doing this multiple times

    # Walk the entire directory
    for root, dirs, files in os.walk("blog/"):
        for file in files:
            # Read the contents of the post
            path = os.path.join(root, file)
            with open(path, "r") as read_file:
                content = read_file.read()

            # If the post has frontmatter use it, otherwise create it
            if content.startswith("---"):
                frontmatter, content = [x for x in content.split("---", 2) if x != ""]
                frontmatter = yaml.safe_load(frontmatter)
            else:
                frontmatter = {}

            # Add the frontmatter attributes to the post's state
            mtime = datetime.datetime.fromtimestamp(os.path.getctime(path))
            post = {}
            post["filename"] = file
            post["title"] = frontmatter.get("title", post["filename"].replace(".md", ""))
            post["slug"] = frontmatter.get("slug", post["title"].lower().replace(" ", "-"))
            post["created"] = frontmatter.get("created", mtime)
            post["updated"] = frontmatter.get("updated", "")
            post["hash"] = frontmatter.get("hash", "")
            post["content"] = content

            # If the creation time is not a datetime, convert it into one
            ctime = post["created"]
            if not isinstance(ctime, datetime.datetime): post["created"] = datetime.datetime(ctime.year, ctime.month, ctime.day)

            # If the updated time is not a datetime, convert it into one
            utime = post["updated"]
            if utime != "" and not isinstance(utime, datetime.datetime): post["updated"] = datetime.datetime(utime.year, utime.month, utime.day)

            # If the updated time is further than the current date, set it to the last modified time of the file
            if utime != "" and utime > datetime.datetime.now(): post["updated"] = mtime

            # If the post has been updated, set the updated date to the most recent modification date
            if (mtime > post["created"] and utime == "") or mtime > utime:
                # Calculate the SHA-256 hash of the file (adapted from https://www.geeksforgeeks.org/python/how-to-detect-file-changes-using-python/)
                with open(path, "rb") as byte_file:
                    file_bytes = byte_file.read()
                file_bytes = file_bytes.split(b"---", 2)[2]
                file_hash = hashlib.sha256(file_bytes).hexdigest()

                # If the hashes don't match, then update the modification time
                if post["hash"] == "" or post["hash"] != file_hash:
                    post["updated"] = mtime
                    post["hash"] = file_hash

            # If the post has an empty updated field, ignore it
            if post["updated"] == "": del post["updated"]

            # Append the (updated) post to the list of posts
            POSTS.append(post.copy())

            # If the frontmatter did not change then don't write to the file
            if frontmatter == post: continue

            # Write the updated yaml to the file (excluding the content)
            del post["content"]
            with open(path, "w") as write_file:
                write_file.write("---\n")
                yaml.safe_dump(post, write_file, default_flow_style=False, sort_keys=False)
                write_file.write("---\n\n")
                write_file.write(content.lstrip("\n"))

    # Sort the posts by their modification date (newest first)
    POSTS.sort(key = lambda x: x["updated"] if "updated" in x else x["created"], reverse=True)


def render_homepage():
    global ENV
    print("The homepage is now being created.")

    # Get the homepage template and render it
    homepage = ENV.get_template("homepage.html")
    output = homepage.render()

    # Write the render to the index.html file
    with open("public/index.html", "w") as file:
        file.write(output)

    print("\033[0;32mThe homepage has successfully been created.\033[0m\n\n")


def render_posts():
    global ENV
    markdown = mistune.create_markdown(plugins=['strikethrough', 'footnotes', 'table', 'url', 'task_lists', 'abbr', 'mark', 'insert', 'superscript', 'subscript', 'math', 'spoiler'], escape=False, hard_wrap=True)

    # Remove all currently generated templates (prevents duplicates if the dates change)
    shutil.rmtree("public/blog")

    # Store the post template in memory
    post_template = ENV.get_template("post.html")

    # Render every post
    for post in POSTS:
        print(f"The {post["title"]} page is now being created.")

        # Render the post
        post["content"] = markdown(post["content"])

        # Render the post using the template
        output = post_template.render(post=post)

        # Create the path of the output render and make the directory
        path = os.path.join("public", "blog", f"{post["created"].year:02}", f"{post["created"].month:02}", f"{post["created"].day:02}")
        os.makedirs(path, exist_ok=True)

        # Write the render to a file
        with open(f"{os.path.join(path, post["slug"])}.html", "w") as file:
            file.write(output)
        
        print(f"\033[0;32mThe page for the {post["title"]} post has successfully been created.\033[0m\n")


if __name__ == '__main__':
    update_posts()
    render_homepage()
    render_posts()