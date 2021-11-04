# Services
A services layer allows to group together commonly used functions and serve as an abstraction layer between Firebase and the rest of the system. 

## User Services
User services manage all operations concerning users.

### `get({['userID' | 'username']: String}): PTUser`
Gets a user either by userID or username. 

### `update(userID: String, data: PTUser): Promise`
Updates data of a specific user. 

### `uploadProfilePicture(userID: String, file: File): Promise`
(Under development) Uploads a file to serve as the profile picture of the user. 

### `getExercises(userID: String): Promise<{exerciseID: String, title: String}>`
Returns the title and exercise id of all the exercises authored by this user. 

## Exercise Services
Exercise services manage all CRUD operations concerning services

### `create(data: PTExercise): Promise`
Creates a new exercise authored by the currently authenticated user. 

### `get(exerciseID: String): Promise<PTExercise>`
Gets a specific exercise using its exerciseID.

### `update(exerciseID: String, data: PTExercise, currentUser: PTUser): Promise`
> Only available if the currently authenticated user is the author of the exercise
Updates the contents of a specific exercise identified using its exerciseID.

### `remove(exerciseID: String, currentUser: PTUser): Promise`
> Only available if the currently authenticated user is the author of the exercise
Deletes the exercise and all its associated contents. 