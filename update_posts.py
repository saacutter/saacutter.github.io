import os
import datetime
import yaml

def update_posts():
    POSTS = []

    # Walk the entire directory
    for root, dirs, files in os.walk("blog/"):
        for file in files:
            # Read the contents of the post
            path = os.path.join(root, file)
            with open(path, "r") as read_file:
                content = read_file.read()

            # If the post does not have frontmatter skip it, otherwise use default values
            if content.startswith("---"):
                frontmatter, content = [x for x in content.split("---", 2) if x != ""]
                frontmatter = yaml.safe_load(frontmatter)
            else:
                frontmatter = {}

            mtime = datetime.date.fromtimestamp(os.path.getctime(path))

            # Add the frontmatter attributes to the post's state
            post = {}
            post["filename"] = file
            post["title"] = frontmatter.get("title", post["filename"].replace(".md", ""))
            post["slug"] = frontmatter.get("slug", post["title"].lower().replace(" ", "-"))
            post["created"] = frontmatter.get("created", mtime)

            # If the post has been updated, set the updated date to the most recent modification date
            if mtime > post["created"]: post["updated"] = mtime
            else: post["updated"] = ""

            # Write the updated yaml to the file
            with open(path, "w") as write_file:
                write_file.write("---\n")
                yaml.safe_dump(post, write_file, default_flow_style=False, sort_keys=False)
                write_file.write("---\n\n")
                write_file.write(content.lstrip("\n"))


if __name__ == '__main__':
    update_posts()