import os
import datetime
import yaml
import hashlib

def update_posts():
    POSTS = []

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

            # If the creation time is not a datetime, convert it into one
            ctime = post["created"]
            if not isinstance(ctime, datetime.datetime): post["created"] = datetime.datetime(ctime.year, ctime.month, ctime.day)

            # If the updated time is not a datetime, convert it into one
            utime = post["updated"]
            if utime != "" and not isinstance(utime, datetime.datetime): post["updated"] = datetime.datetime(utime.year, utime.month, utime.day)

            # If the updated time is further than the current date, set it to the last modified time of the file
            if post["updated"] > datetime.datetime.now(): post["updated"] = mtime

            # If the post has been updated, set the updated date to the most recent modification date
            if (mtime > post["created"] and post["updated"] == "") or mtime > post["updated"]:
                # Calculate the SHA-256 hash of the file (adapted from https://www.geeksforgeeks.org/python/how-to-detect-file-changes-using-python/)
                with open(path, "rb") as byte_file:
                    file_bytes = byte_file.read()
                file_bytes = file_bytes.split(b"---", 2)[2]
                file_hash = hashlib.sha256(file_bytes).hexdigest()

                # If the hashes don't match, then update the modification time
                if post["hash"] == "" or post["hash"] != file_hash:
                    post["updated"] = mtime
                    post["hash"] = file_hash

            # If the frontmatter did not change then don't write to the file
            if frontmatter == post: continue

            # Write the updated yaml to the file
            with open(path, "w") as write_file:
                write_file.write("---\n")
                yaml.safe_dump(post, write_file, default_flow_style=False, sort_keys=False)
                write_file.write("---\n\n")
                write_file.write(content.lstrip("\n"))


if __name__ == '__main__':
    update_posts()