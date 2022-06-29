"""

"""
from crypt import methods
import json
import os
import tempfile
from flask import Flask, abort, redirect, render_template, request, session
from sympy import re
from pt_Firebase import database, authentication, bucket, exceptions as firebase_exceptions
from notebooks.pt_Notebook import pt_Notebook
from notebooks.pt_NotebookItem import pt_NotebookItem
from notebooks.pt_Question import pt_Question


app = Flask(__name__)
app.secret_key = "PhysTr41n3r"
app.config["TEMPLATES_AUTO_RELOAD"] = True # https://stackoverflow.com/a/54852798/2276332

"""
CONFIGURATION AND ERROR HANDLERS
"""
# 404
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

"""
STATIC ENDPOINTS
These routes redirect to test or static endpoints
"""
# Base route may be changed later
@app.route("/")
def hello_world():
    #return "<p>Hello, World!</p>"
    return redirect("/explore")

# May be changed later
@app.route("/constuction")
@authentication.login_optional_decorator
def render_construction(user):
    return render_template("construction.html", user=user)

"""
AUTHENTICATION
These routes handle user authentication (login and register)
"""
# Login screen
@app.route("/login", methods=["GET"])
def render_login():
    return render_template("login.html")

# Logout screen
@app.route("/logout", methods=["GET"])
def logout():
    if("current_id_token" in session):
        session.pop("current_id_token")
    return redirect("/login")

# API login
@app.route("/api/auth/login", methods=["POST"])
def login():
    user = None
    try:
        # Receive email and password
        email = request.form.get("email")
        password = request.form.get("password")
        # Generate id token and store in session
        token = authentication.sign_in_with_email_and_password(email=email, password=password)
        session["current_id_token"] = token
        # Get user
        user = authentication.get_user_by_id_token(token)
    except Exception as e:
        abort(403)
    # Redirect back
    if(request.args.get("redirect") is not None):
        return redirect(request.args.get("redirect"))
    if(request.args.get("json")):
        return user._data
    return redirect("/explore")

# API send reset link
@app.route("/api/auth/reset-password", methods=["POST"])
def reset_password():
    try:
        data = request.get_json(force=True)
        email = data["email"]
        authentication.email_password_reset_link(email)
        return {
            "message": "success", 
            "email": email
        }
    except:
        abort(403)

"""
PROFILE MANAGEMENT (ME)
These are routes for updating profile info
"""
# Get my profile
@app.route("/me", methods=["GET"])
@authentication.login_required_template_decorator
def render_me(user):
    try:
        # Get notebooks
        notebooks = pt_Notebook.read_by_author(user.uid)
        return render_template("user.html", user=user, notebooks=notebooks, protected=False)
    except:
        abort(500)

# API Update my photo
@app.route("/api/me/photo", methods=["POST"])
@authentication.login_required_decorator
def upload_user_photo(user):
    try:
        # Get and store photo
        photo = request.files["photo"]
        # Upload
        blob = bucket.blob("users/photos/"+user.uid)
        blob.upload_from_file(photo)
        # Get public url
        blob.make_public()
        url = blob.public_url
        # Update user info
        authentication.update_user(uid=user.uid, photo_url=url)
        # Return
        return {
            "message": "success"
        }
    except:
        abort(500)

# API Update my info
@app.route("/api/me/update", methods=["POST"])
@authentication.login_required_decorator
def update_user_info(user):
    try:
        # Get json data
        data = request.get_json(force=True)
        data["uid"] = user.uid
        # Update user info
        authentication.update_user(**data)
        return {
            "message": "success"
        }
    except:
        abort(500)


"""
DISCOVERY
Endpoints for the discovery of new content and notebooks
"""
# Get explore page
@app.route("/explore", methods=["GET"])
@authentication.login_optional_decorator
def render_explore(user):
    try:
        docs = []
        for doc in database.collection("pt_notebooks").stream():
            doc_dict = doc.to_dict()
            doc_dict["id"] = doc.id
            docs.append( pt_Notebook(doc_dict).to_dict_protected() )
        return render_template("explore.html", docs=docs, user=user)
    except:
        abort(500)

"""
NOTEBOOKS
For managing notebooks and contents
"""
# Create a new notebook
@app.route("/notebooks/new", methods=["GET"])
@authentication.login_required_template_decorator
def render_new_notebook(user):
    return render_template("notebook-new.html", user=user)

# Get a notebook by id
@app.route("/notebooks/<notebook_id>", methods=["GET"])
@authentication.login_optional_decorator
def render_notebook(user, notebook_id):
    try:
        # Get notebook
        notebook = pt_Notebook.read(notebook_id)
        # Check ownership and protect
        if(user is None or notebook.author_uid != user.uid):
            notebook.protected = True
        else:
            notebook.protected = False
        return render_template("notebook.html", notebook=notebook, user=user)
    except firebase_exceptions.NotFoundError:
        abort(404)
    except Exception as e:
        print(e)
        abort(500)

# API Create a new notebook
@app.route("/api/notebooks/", methods=["POST"])
@authentication.login_required_decorator
def create_notebook(user):
    try:
        # Get data
        dict = request.get_json(force=True)
        # Attatch uid of current user
        dict["author_uid"] = user.uid
        nb = pt_Notebook(dict)
        nb.update({})
        return nb.to_dict()
    except:
        abort(500)

# API Update notebook
@app.route("/api/notebooks/<notebook_id>/update", methods=["POST"])
@authentication.login_required_decorator
def update_notebook(user, notebook_id):
    try: 
        # Get data and notebook
        data = request.get_json(force=True)
        notebook = pt_Notebook.read(notebook_id)
        # See permissions
        if(notebook.author_uid != user.uid):
            return abort(401)
        # Update and return
        return notebook.update(data).to_dict()
    except firebase_exceptions.NotFoundError:
        abort(404)
    except:
        abort(500)

# API Delete notebook
@app.route("/api/notebooks/<notebook_id>/delete", methods=["POST"])
@authentication.login_required_decorator
def delete_notebook(user, notebook_id):
    try:
        notebook = pt_Notebook.read(notebook_id)
        # Permissions
        if(notebook.author_uid != user.uid):
            return abort(401)
        # Delete
        notebook.delete()
        return {
            "message": "success"
        }
    except firebase_exceptions.NotFoundError:
        return {
            "message": "success"
        }
    except:
        abort(500)

"""
NOTEBOOKS/CONTENTS
Paths for CRUD operations with notebook cells.
Paths for answer verification
"""
# API Add new content
@app.route("/api/notebooks/<notebook_id>/contents", methods=["POST"])
@authentication.login_required_decorator
def add_contents(user, notebook_id):
    try:
        # Get type
        type = request.get_json(force=True)["type"]
        # Get notebook and check ownership
        notebook = pt_Notebook.read(notebook_id)
        # Check permissions
        if(notebook.author_uid != user.uid):
            return abort(403)
        # Add content
        new_content = notebook.add_content(type)
        return new_content.to_json()
    except firebase_exceptions.NotFoundError:
        abort(404)
    except:
        abort(500)

# API Update content
@app.route("/api/notebooks/<notebook_id>/contents/<item_id>/update", methods=["POST"])
@authentication.login_required_decorator
def update_contents(user, notebook_id, item_id):
    try:
        # Get new data
        new_data = request.get_json(force=True)
        # Get notebook
        notebook = pt_Notebook.read(notebook_id)
        # Check permissions
        if(notebook.author_uid != user.uid):
            abort(403)
        # Get item data and assign ids
        item_ref = database.collection("pt_notebooks").document(notebook_id).collection("contents").document(item_id).get()
        item_dict = item_ref.to_dict()
        item_dict["id"] = item_ref.id
        item_dict["notebook_id"] = notebook_id
        # Wrap inside classes
        item = None
        if(item_dict["type"] == "text"):
            item = pt_NotebookItem(item_dict)
        elif(item_dict["type"] == "question"):
            item = pt_Question(item_dict)
        # Update
        item.update(new_data)
        # Return 
        return item.to_dict()
    except firebase_exceptions.NotFoundError:
        return abort(404)
    except:
        return abort(500)

# API delete content
@app.route("/api/notebooks/<notebook_id>/contents/<item_id>/delete", methods=["POST"])
@authentication.login_required_decorator
def delete_contents(user, notebook_id, item_id):
    try:
        # Get notebook
        notebook = pt_Notebook.read(notebook_id)
        # Check permissions
        if(notebook.author_uid != user.uid):
            abort(403)
        # Get item
        item = pt_NotebookItem.read(notebook_id=notebook_id, item_id=item_id)
        # Delete
        item.delete()
        return {
            "message": "success"
        }
    except firebase_exceptions.NotFoundError:
        abort(404)
    except:
        abort(500)

# API answer
@app.route("/api/notebooks/<notebook_id>/contents/<item_id>/submit", methods=["POST"])
def post_submission(notebook_id, item_id):
    try:
        # Get submission
        submission = request.get_json(force=True)["submission"]
        # Get question
        question = pt_Question.read(notebook_id=notebook_id, item_id=item_id)
        # Verify answer
        feedback = question.verify_submission(submission)
        # Register submission (???)
        return {
            "score": 1 if feedback else 0
        }
    except firebase_exceptions.NotFoundError:
        abort(404)
    except:
        abort(500)


if __name__ == "__main__":
    app.run()