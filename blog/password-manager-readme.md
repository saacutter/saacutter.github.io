---
root: blog/
filename: password-manager-readme.md
title: Password Manager
slug: password-manager-readme
created: 2026-01-07 00:00:00
modified: 2026-01-13 12:40:50.983888
hash: e995988cf677defec59ded2e22f5e883337744cde63b7a7cb356a0e32dd02153
---

# Password Manager

## Launching the Application
The following steps should be taken in order to setup and start running the application. 
### Creating the Virtual Environment
1. Install the [Python interpreter](https://www.python.org/downloads/) for your operating system.
    - This was developed using Python 3.12.3, the latest version of Python available on Ubuntu 24.04.

2. Create and activate a virtual environment.
    - A virtual environment can be created using `python -m venv /path/to/venv`.
    - The virtual environment is activated depending on the operating system:
        - Linux and MacOS: `source path/to/venv/bin/activate`
        - Windows Command Prompt: `path\to\venv\Scripts\activate`
        - Windows Powershell: `path\to\venv\Scripts\Activate.ps1`
    - The virtual environment can be stopped at any time using the `deactivate` command (operating system agnostic).

3. Install the dependencies for the project backend.
```bash
pip install -r requirements.txt
```

### Setting Environment Variables
1. Create a new file in the root directory with the filename `.env`.
    - The directory tree should look like the following (excluding the virtual environment, which should be created as above):
        <pre>
        .
        ├── .env
        ├── .flaskenv
        ├── README.md
        ├── app
        │   ├── __init__.py
        │   ├── app.db
        │   ├── config.py
        │   ├── controllers.py
        │   ├── forms.py
        │   ├── models.py
        │   ├── routes.py
        │   ├── static
        │   │   ├── css
        │   │   │   ├── raw.css
        │   │   │   └── styles.css
        │   │   └── js
        │   │       ├── danger.js
        │   │       ├── details.js
        │   │       ├── get_passwords.js
        │   │       ├── image_preview.js
        │   │       └── password_manager.js
        │   └── templates
        │       ├── _errors.html
        │       ├── base.html
        │       ├── depricated
        │       │   ├── add.html
        │       │   └── signup.html
        │       ├── edit-password.html
        │       ├── home.html
        │       ├── index.html
        │       ├── login.html
        │       ├── register.html
        │       └── user.html
        ├── manager.py
        ├── migrations
        │   ├── README 
        │   ├── alembic.ini
        │   ├── env.py
        │   ├── script.py.mako
        │   └── versions
        │       ├── c32ef7995544_added_tables.py
        │       └── c6c5a2065beb_updated_passwords_last_login_to_last_.py
        ├── package-lock.json
        ├── package.json
        └── requirements.txt
        </pre>

2. Add the secret key to the file, e.g. `SECRET_KEY="this-is-a-secret-key"`
    - As this is just setting an environment variable, the following can also be done:
        - Linux and MacOS: `export SECRET_KEY="this-is-a-secret-key"`
        - Windows: `set SECRET_KEY="this-is-a-secret-key"`

3. (Optional) Add the SQLAlchemy database URL to the file, e.g. `DATABASE_URL="sqlite:///app.db"`
    - This is another environment variable, and can be set in the same way as above.


### Starting the Application
1. Initialise the database using `flask db upgrade`
    - If the database isn't initialising properly, using `flask db init` and then applying the migrations may work

2. Start the flask application using `flask run`.
    - Note that the `.flaskenv` file sets the `FLASK_APP` environment variable. If this does not work, the following should be done:
        - Linux and MacOS: `export FLASK_APP=manager.py`
        - Windows: `set FLASK_APP=manager.py`