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

# Walk the entire directory
for root, dirs, files in os.walk("blog/"):
    for file in files:
        # If the file is not a markdown file, copy it to the location where the rendered markdown would be
        if not file.endswith(".md"): continue

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
        post["root"] = root
        post["filename"] = file
        post["title"] = frontmatter.get("title", post["filename"].replace(".md", ""))
        post["slug"] = frontmatter.get("slug", post["title"].lower().replace(" ", "-"))
        post["created"] = frontmatter.get("created", mtime)
        post["modified"] = frontmatter.get("modified", "")
        post["hash"] = frontmatter.get("hash", "")
        post["content"] = content

        # If the creation time is not a datetime, convert it into one
        ctime = post["created"]
        if not isinstance(ctime, datetime.datetime): post["created"] = datetime.datetime(ctime.year, ctime.month, ctime.day)

        # If the modification time is not a datetime, convert it into one
        utime = post["modified"]
        if utime != "" and not isinstance(utime, datetime.datetime): post["modified"] = datetime.datetime(utime.year, utime.month, utime.day)

        # If the creation or modification times are further than the current date, set it to the most recent modification datetime
        if ctime > datetime.datetime.now(): post["created"] = mtime
        if utime != "" and utime > datetime.datetime.now(): post["modified"] = mtime

        # If the post has been updated, set the modification date to the most recent modification datetime
        if post["hash"] == "" or (utime == "" and mtime > post["created"]) or (utime != "" and mtime > utime):
            # Calculate the SHA-256 hash of the file (adapted from https://www.geeksforgeeks.org/python/how-to-detect-file-changes-using-python/)
            with open(path, "rb") as byte_file:
                file_bytes = byte_file.read()
            file_bytes = file_bytes.split(b"---", 2)[2] if file_bytes.startswith(b"---") else file_bytes
            file_hash = hashlib.sha256(file_bytes.lstrip(b"\n")).hexdigest() # Has to strip the starting newline characters because it would make it seem like a new file if any post didn't have frontmatter

            # If the hashes don't match, then update the modification time
            if post["hash"] == "" or post["hash"] != file_hash:
                if post["hash"] != "": post["modified"] = mtime
                post["hash"] = file_hash

        # If the post has an empty modification field, ignore it
        if post["modified"] == "" or post["created"] == post["modified"]: del post["modified"]

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
POSTS.sort(key = lambda x: x["modified"] if "modified" in x else x["created"], reverse=True)


print("The homepage is now being created.")

# Get the homepage template and render it
homepage = ENV.get_template("homepage.html")
output = homepage.render()

# Write the render to the index.html file
with open("public/index.html", "w") as file:
    file.write(output)

print("\033[0;32mThe homepage has successfully been created.\033[0m\n\n")


markdown = mistune.create_markdown(plugins=['strikethrough', 'footnotes', 'table', 'url', 'task_lists', 'abbr', 'mark', 'insert', 'superscript', 'subscript', 'math', 'spoiler'], escape=False, hard_wrap=True)

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
    path = os.path.join("public", "blog", f"{post["created"].year:02}", f"{post["created"].month:02}", f"{post["created"].day:02}", post["slug"])
    os.makedirs(path, exist_ok=True)
    
    # Write the render to a file
    with open(f"{os.path.join(path, post["slug"])}.html", "w") as file:
        file.write(output)

    # If the file was in a directory, then copy over all other contents to make it accessible to the rendered HTML post
    if len(os.path.join(post["root"], post["filename"]).split("/")) > 2:
        for root, dirs, files in os.walk(post["root"]):
            for file in files:
                if not file.endswith(".md"): shutil.copy(os.path.join(root, file), path)
        
    print(f"\033[0;32mThe page for the {post["title"]} post has successfully been created.\033[0m\n")