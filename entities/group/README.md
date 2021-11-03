# Groups
Groups allow to simultaneously share content among multiple users. They are useful especially in the context of classes of learners or users with similar interests. 

## `PTGroup` object
All groups are normalized into the following schema, with the properties: 

### `name: String`
Name or title of the group. This is limited to 100 characters

### `description: String`
Brief description about the group. Can include links or markdown. 

### `creationDate: Date`, 
Date the group was created

### `members: {role: String, user: User|UserRef}[]`
Array of user objects with their roles. In descendent order of priviledges, such roles can be: 
- **admin** Usually the creator of the group. Can add or delete other members. 
- **editor** Can share content within the group.
- **commenter** Can comment on content shared within the group.
- **viewer** Can only see the content inside the group

THe user attribute can be either a user object or a the path to its reference. 

### `content: []`
Array with contents of the group. Still to be defined. 