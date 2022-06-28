from notebooks.pt_Notebook import pt_Notebook
from pt_Firebase import database, firestore

class pt_Collection:
    @classmethod
    def read(cls, id: str):
        # Document
        doc = database.collection("pt_collection").document(id).get()
        doc_dict = doc.to_dict()
        doc_dict["id"] = doc.id
        # Return
        return cls(doc_dict)

    id: str = ""
    name: str = ""
    description: str = ""
    author_uid: str = ""
    notebook_ids: list = []
    notebooks: list[pt_Notebook] = []

    def __init__(self, data: dict) -> None:
        self.id = data.get("id", "")
        self.name = data.get("name", "")
        self.description = data.get("description", "")
        self.author_uid = data.get("author_uid", "")
        self.notebook_ids = data.get("notebook_ids", [])

    def get_notebooks(self):
        """for id in self.notebook_ids:
            notebook = pt_Notebook.read(id)
            self.notebooks.append(notebook)
        """
        self.notebooks = map(lambda id: pt_Notebook.read(id), self.notebook_ids)

    def add_notebook(self, id: str):
        database.collection("pt_collection").document(self.id).update({
            "notebooks": firestore.firestore.ArrayUnion([ database.doc("pt_notebooks/"+id) ])
        })

    def remove_notebook(self, id: str):
        database.collection("pt_collection").document(self.id).update({
            "notebooks": firestore.firestore.ArrayRemove([ database.doc("pt_notebooks/"+id) ])
        })

    