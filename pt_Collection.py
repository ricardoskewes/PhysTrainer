from typing import Optional
from notebooks.pt_Notebook import pt_Notebook
from pt_Firebase import database, exceptions as firebase_exceptions, firestore
from pt_DBCache import cache

class pt_Collection:
    @classmethod
    def read(cls, id: str, include_contents: Optional[bool] = True, include_notebook_contents: Optional[bool] = False):
        # Check in cache
        cached = cache.collection("pt_collections").get_data(id)
        if(cached is not None):
            if(include_contents):
                cached.get_contents()
            return cached
        doc = database.collection("pt_collections").document(id).get()
        if(doc.exists == False):
            raise firebase_exceptions.NotFoundError("404")
        doc_dict = doc.to_dict()
        doc_dict["id"] = doc.id
        collection = cls(doc_dict)
        if(include_contents):
            collection.get_contents(include_notebook_contents)
        # Store in cache
        cache.collection("pt_collections").add_data(id, collection)
        return collection


    id: str = ""
    title: str = ""
    description: str = ""
    author_uid: str = ""
    notebooks: list[pt_Notebook] = []
    __notebook_references: list = []

    def __init__(self, data: dict):
        self.id = data.get("id", None)
        self.title = data.get("title", "")
        self.description = data.get("description", "")
        self.author_uid = data.get("author_uid", "")

        for item in data.get("notebooks", []):
            if(isinstance(item, pt_Notebook)):
                self.notebooks.append(item)
                self.__notebook_references.append(item.id)
            elif(item.__class__.__name__ == "DocumentReference"):
                self.__notebook_references.append(item)
            elif(isinstance(item, str)):
                self.__notebook_references.append( database.collection("pt_notebooks").document(item) )

    def to_dict(self):
        return {
            "id": self.id, 
            "title": self.title, 
            "description": self.description,
            "author_uid": self.author_uid, 
            "notebooks": list(map(lambda n: n.to_dict(), self.notebooks))
        }

    def get_contents(self, include_notebook_contents: Optional[bool] = False):
        self.notebooks = []
        for doc in self.__notebook_references:
            try:
                notebook = pt_Notebook.read(doc.id, include_contents=include_notebook_contents)
                self.notebooks.append(notebook)
            except firebase_exceptions.NotFoundError:
                self.remove_notebook(doc)
                pass

    def remove_notebook(self, doc):
        # Convert to doc reference
        if(isinstance(doc, str)):
            doc = database.collection("pt_notebooks").document(doc)
        if(doc.__class__.__name__ != "DocumentReference"):
            raise Exception("Incorrect data type")
        # Get local index
        local_index = next((index for index, value in enumerate(self.notebooks) if value.id == doc.id), -1)
        # Delete from notebooks (local)
        if(local_index != -1):
            self.notebooks.pop(local_index)
        # Delete from array in firebase
        database.collection("pt_collections").document(self.id).update({
            "notebooks": firestore.firestore.ArrayRemove([doc])
        })
        # Store updates in cache
        cache.collection("pt_collections").add_data(self.id, self)
        return True

    def add_notebook(self, doc):
        # Convert to doc reference
        if(isinstance(doc, str)):
            doc = database.collection("pt_notebooks").document(doc)
        if(isinstance(doc, pt_Notebook)):
            doc = database.collection("pt_notebooks").document(doc.id)
        if(doc.__class__.__name__ != "DocumentReference"):
            raise Exception("Incorrect data type")
        # Get local index
        local_index = next((index for index, value in enumerate(self.notebooks) if value.id == doc.id), -1)
        # If exists, return
        if(local_index != -1):
            return True
        # Get notebook and see if exists
        notebook = None
        try:
            notebook = pt_Notebook.read(doc.id)
        except firebase_exceptions.NotFoundError:
            return True
        # Add to Array in firebase
        database.collection("pt_collections").document(self.id).update({
            "notebooks": firestore.firestore.ArrayUnion([doc])
        })
        # Add to local
        self.__notebook_references.append(doc)
        self.notebooks.append(notebook)
        # Store updates in cache
        cache.collection("pt_collections").add_data(self.id, self)
        return True
    
    def update(self, new_data: dict):
        # Assign new values
        for key in new_data:
            if(key != "id" and key != "notebooks" and key != "author_uid"):
                setattr(self, key, new_data[key])
        # Get reference
        ref = database.collection("pt_collections")
        # Convert to dict and remove fields
        dict = self.to_dict()
        del dict["notebooks"]
        del dict["id"]
        # Update or add
        if(self.id is None):
            new_doc = ref.add(dict)
            self.id = new_doc[1].id
        else:
            ref.document(self.id).set(dict)
        # Store updates in cache
        cache.collection("pt_collections").add_data(self.id, self)
        return self

    def delete(self):
        if(self.id is None):
            return
        database.collection("pt_notebooks").document(self.id).delete()
        # Store updates in cache
        cache.collection("pt_collections").remove_data(self.id)
        return True