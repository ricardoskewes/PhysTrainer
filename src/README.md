# API
An API is needed to provide reliable, backend-agnostic communication with stored data and user scopes. 

## Endpoints

----

Users
--
Used to manage user data and profiles

### `POST /api/1/users/passwordreset`
(Under development) Sends a link to reset password through mail.

**Params**
- __email__ (Required) Email to send the link to.


### `GET /api/1/users`
Gets a specific user, either through username or userID. 
> This is the only endpoint that uses username to identify a user

**Params**
- __userID__ Id of user to get
- __username__ Username of user to get

### `GET /api/1/users/exercises`
Gets the ids and titles of the exercises authored by a user.
**Params**
- __userID__ (Required) Id of user to get exercises from

### `POST /api/1/users/update`
Updates the info of the currently authenticated user.

**Body**
JSON PTUser object

### `POST /api/1/users/pic`
Uploads a profile picture for the currently authenticated user.

**Body**
Image File

----

Exercises
--
Used to manage exercises

### `GET /api/1/exercises/`
Gets a specific exercise.

**Params**
- __exerciseID__ (Required) Id of exercise to get


### `POST /api/1/exercises/create`
Creates a new exercise, authored by the currently authenticated user.

**Body**
{"title"}

### `POST /api/1/exercises/update`
Updates an exercise. Only available if said exercise is authored by the currently authenticated user.

**Params**
- __exerciseID__ (Required) Id of exercise to update

**Body**
JSON PTExercise object

### `POST /api/1/exercises/delete`
Deletes an exercise. Only available if said exercise is authored by the currently authenticated user.

**Params**
- __exerciseID__ (Required) Id of exercise to delete


----
<div style="background: red; color: white; text-align: center">Endpoints below have not yet been implemented, and likely wont for the MVP release</div>

Groups
--
Used to manage data about groups of users

### `GET /api/1/groups`
Returns all the groups the authenticated user belongs to

### `PUT /api/1/groups`
Creates a new group

### `GET /api/1/groups/:groupID`
Returns data about a specific group. Consider public/private groups.

### `POST /api/1/groups/:groupID`
Consider role of authenticated user. Modifies data about a group. 

### `PUT /api/1/groups/:groupID/`
Shares data to a group. Can be a collection, text, link, etc.

----

Collections
--
Used to manage collections of exercises

### `GET /api/1/collections`
(Admin users) Will return all the collections in the system
(Common users) Will return all the collections the requester user owns or is following

### `PUT /api/1/collections`
Creates a new collection associated with requester user

### `GET /api/1/collections/:collectionID`
Will return available data about a specific collection of excercises

### `POST /api/1/collections/:collectionID`
Only available if the requester is the author of said collection. Modifies the collection data

### `GET /api/1/collections/:collectionID/exercies`
Gets all the exercises inside a collection

----

Question submissions
--
Used to get and send all the submissions of data. Special considerations on security are needed here as this section is vulnerable to attacks or XSS from learners.

### `GET /api/1/submissions/:questionID`
If the requester is the author of the exercise the question belongs to, returns all submissions made to the question.
Otherwise, returns all submissions made by the authenticated user

### `POST /api/1/submissions/:questionID`
Submits an answer to a question. Returns feedback data to the learner

### `PUT /api/1/submissions/:questionID`
Does the same as `POST /api/1/submissions/:questionID`

-----
Search
--
Used to perform searches throughout the system

### ``