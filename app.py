"""

"""
from crypt import methods
import json
import os
import tempfile
from flask import Flask, abort, redirect, render_template, request, session
from pt_Firebase import database, authentication, bucket
from notebooks.pt_Notebook import pt_Notebook
from notebooks.pt_NotebookItem import pt_NotebookItem
from notebooks.pt_Question import pt_Question


app = Flask(__name__)
app.secret_key = "PhysTr41n3r"
app.config["TEMPLATES_AUTO_RELOAD"] = True # https://stackoverflow.com/a/54852798/2276332

"""
STATIC ENDPOINTS
These routes redirect to test or static endpoints
"""
@app.route("/")
def hello_world():
    #return "<p>Hello, World!</p>"
    return redirect("/explore")

@app.route("/constuction")
@authentication.login_optional_decorator
def render_construction(user):
    return render_template("construction.html", user=user)

"""
AUTHENTICATION
These routes handle user authentication (login and register)
"""

@app.route("/login", methods=["GET"])
def render_login():
    return render_template("login.html")

@app.route("/login", methods=["POST"])
def login():
    email = request.form.get("email")
    password = request.form.get("password")
    token = authentication.sign_in_with_email_and_password(email=email, password=password)
    session["current_id_token"] = token
    user = authentication.get_user_by_id_token(token)
    # Redirect back
    if(request.args.get("redirect") is not None):
        return redirect(request.args.get("redirect"))
    if(request.args.get("json")):
        return user._data
    return redirect("/explore")

@app.route("/logout", methods=["GET"])
def logout():
    if("current_id_token" in session):
        session.pop("current_id_token")
    return redirect("/login")

"""
PROFILE MANAGEMENT (ME)
These are routes for updating profile info
"""
@app.route("/me", methods=["GET"])
@authentication.login_required_template_decorator
def render_me(user):
    # Get notebooks
    notebooks = pt_Notebook.read_by_author(user.uid)
    return render_template("user.html", user=user, notebooks=notebooks, protected=False)

@app.route("/me/photo", methods=["POST"])
@authentication.login_required_decorator
def upload_user_photo(user):
    # Get and store photo
    photo = request.files["photo"]
    temp = tempfile.NamedTemporaryFile(delete=False)
    # Upload
    blob = bucket.blob("users/photos/"+user.uid)
    blob.upload_from_file(photo)
    # Get public url
    blob.make_public()
    url = blob.public_url
    # Update user info
    authentication.update_user(uid=user.uid, photo_url=url)
    # Return
    return "done"

@app.route("/me/update", methods=["POST"])
@authentication.login_required_decorator
def update_user_info(user):
    # Get json data
    data = request.get_json(force=True)
    data["uid"] = user.uid
    # Update user info
    authentication.update_user(**data)
    return "done"


"""
DISCOVERY
Endpoints for the discovery of new content and notebooks
"""
@app.route("/explore", methods=["GET"])
@authentication.login_optional_decorator
def render_explore(user):
    docs = []
    for doc in database.collection("pt_notebooks").stream():
        doc_dict = doc.to_dict()
        doc_dict["id"] = doc.id
        docs.append( pt_Notebook(doc_dict).to_dict_protected() )
    return render_template("explore.html", docs=docs, user=user)

@app.route("/explore/raw", methods=["GET"])
@authentication.login_optional_decorator
def explore_all_notebooks(user):
    docs = []
    for doc in database.collection("pt_notebooks").stream():
        doc_dict = doc.to_dict()
        doc_dict["id"] = doc.id
        docs.append( pt_Notebook(doc_dict).to_dict_protected() )
    return json.dumps(docs)

"""
NOTEBOOKS
For managing notebooks and contents
"""
@app.route("/notebooks/new", methods=["GET"])
@authentication.login_required_template_decorator
def render_new_notebook(user):
    return render_template("notebook-new.html", user=user)

@app.route("/notebooks/", methods=["POST"])
@authentication.login_required_decorator
def create_notebook(user):
    # Get data
    dict = request.get_json(force=True)
    # Attatch uid of current user
    dict["author_uid"] = user.uid
    nb = pt_Notebook(dict)
    nb.update({})
    return nb.to_dict()

@app.route("/notebooks/<notebook_id>", methods=["GET"])
@authentication.login_optional_decorator
def render_notebook(user, notebook_id):
    # Get notebook
    notebook = pt_Notebook.read(notebook_id)
    # Check ownership and protect
    if(user is None or notebook.author_uid != user.uid):
        notebook.protected = True
    else:
        notebook.protected = False
    return render_template("notebook.html", notebook=notebook, user=user)

@app.route("/notebooks/<notebook_id>/raw", methods=["GET"])
@authentication.login_optional_decorator
def get_notebook(user, notebook_id):
    #try:
    # Get notebook
    nb = pt_Notebook.read(notebook_id)
    if(user is None or nb.author_uid != user.uid):
        return nb.to_dict_protected()
    else:
        return nb.to_dict()
    #except:
    #    return "Error"

@app.route("/notebooks/<notebook_id>/update", methods=["POST"])
@authentication.login_required_decorator
def update_notebook(user, notebook_id):
    data = request.get_json(force=True)
    nb = pt_Notebook.read(notebook_id)
    # Permissions
    if(nb.author_uid != user.uid):
        abort(401)
    return nb.update(data).to_dict()

@app.route("/notebooks/<notebook_id>/delete", methods=["POST"])
@authentication.login_required_decorator
def delete_notebook(user, notebook_id):
    nb = pt_Notebook.read(notebook_id)
    # Permissions
    if(nb.author_uid != user.uid):
        abort(401)
    nb.delete()
    return "done"


"""
NOTEBOOKS/CONTENTS
Paths for CRUD operations with notebook cells.
Paths for answer verification
"""
@app.route("/notebooks/<notebook_id>/contents", methods=["POST"])
@authentication.login_required_decorator
def add_contents(user, notebook_id):
    #try:
    # Get type
    type = request.get_json(force=True)["type"]
    # Get notebook
    nb = pt_Notebook.read(notebook_id)
    # Check ownership
    if(nb.author_uid != user.uid):
        abort(401)
    # Add content
    return nb.add_content(type).to_json()
    #except:
        #return "Error"

@app.route("/notebooks/<notebook_id>/contents/<item_id>/update", methods=["POST"])
@authentication.login_required_decorator
def update_contents(user, notebook_id, item_id):
    #try:
    # Get data
    new_data = request.get_json(force=True)
    # Get notebook
    notebook_ref = database.collection("pt_notebooks").document(notebook_id)
    notebook_dict = notebook_ref.get().to_dict()
    # Check notebook ownership
    if(notebook_dict["author_uid"] != user.uid):
        abort(401)
    # Get item
    item_ref = notebook_ref.collection("contents").document(item_id).get()
    item_dict = item_ref.to_dict()
    item_dict["id"] = item_ref.id
    item_dict["notebook_id"] = notebook_id
    # Give proper classes
    item = None
    if(item_dict["type"] == "text"):
        item = pt_NotebookItem(item_dict)
    if(item_dict["type"] == "question"):
        item = pt_Question(item_dict)
        if("answer" in new_data):
            item.set_answer(new_data["answer"])
    # Update
    item.update(new_data)
    return item.to_dict()
    #except:
    #    return "Error"

@app.route("/notebooks/<notebook_id>/contents/<item_id>/delete", methods=["POST"])
@authentication.login_required_decorator
def delete_contents(user, notebook_id, item_id):
    #try:
    # Get notebook
    notebook = pt_Notebook.read(notebook_id)
    # Check ownership
    if(notebook.author_uid != user.uid):
        abort(401)
    # Get item
    item = pt_NotebookItem.read(notebook_id=notebook_id, item_id=item_id)
    # Delete item
    item.delete()
    return "Deleted"
    #except:
    #    return "Error"

@app.route("/notebooks/<notebook_id>/contents/<item_id>/submit", methods=["POST"])
def post_submission(notebook_id, item_id):
    #try:
    # Get submission
    submission = request.get_json(force=True)["submission"]
    # Get item (as question)
    question = pt_Question.read(notebook_id=notebook_id, item_id=item_id)
    # Verify answer
    feedback = question.verify_submission(submission)
    # Return
    if(feedback):
        return "True"
    else:
        return "False"
    #except:
    #    return "Error"
 

if __name__ == "__main__":
    app.run()