# API
An API is needed to provide reliable, backend-agnostic communication with stored data and user scopes. 

## Endpoints

----

Users
--
Used to manage user data and profiles

### `GET /api/1/users/:username`
Will return a JSON object with relevant information about the user
More info will be shown if the requester is said user

### `POST /api/1/users/:username`
Only available if the requester is said user. Modifies the user data

### `POST /api/1/users/passwordreset`
Sends a password reset email

----
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

Exercises
--
Used to manage exercises

### `GET /api/1/exercises/:exerciseID`
Returns data about an exercise

### `POST /api/1/exercises/:exerciseID`
Modified data from an exercise

### `PUT /api/1/exercises`
Creates a new exercise

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