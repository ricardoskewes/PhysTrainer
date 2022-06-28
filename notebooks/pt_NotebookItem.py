import json
from pt_Firebase import database

class pt_NotebookItem:
    @classmethod
    def read(cls, notebook_id: str, item_id: str):
        # Get item reference
        item_ref = database.collection("pt_notebooks").document(notebook_id).collection("contents").document(item_id)
        item = item_ref.get()
        item_dict = item.to_dict()
        item_dict["id"] = item.id
        return cls(item_dict)

    id: str = ""
    notebook_id: str = ""
    display_index: int = 0
    type: str = ""
    text: str = ""
    
    def __init__(self, data: dict) -> None:
        self.id = data.get("id", None)
        self.notebook_id = data.get("notebook_id", None)
        self.display_index = data.get("display_index", 0)
        self.type = data.get("type", "text")
        self.text = data.get("text", "")

    def to_dict(self):
        return {
            "id": self.id, 
            "notebook_id": self.notebook_id,
            "display_index": self.display_index, 
            "type": self.type, 
            "text": self.text,
        }

    def to_dict_protected(self):
        dict = self.to_dict()
        dict["protected"] = True
        return dict

    def to_json(self):
        return json.dumps(self.to_dict())

    def to_json_protected(self):
        return json.dumps(self.to_dict_protected())

    def update(self, new_data: dict):
        if(self.notebook_id is None):
            return
        # Assign new values
        for key in new_data:
            if(key != "id" and key != "type" and key != "notebook_id"):
                setattr(self, key, new_data[key])
        # Get reference
        ref = database.collection("pt_notebooks").document(self.notebook_id).collection("contents")
        # Convert to dict
        dict = self.to_dict()
        del dict["id"]
        # Update or add
        if(self.id is None):
            ref.add(dict)
        else:
            ref.document(self.id).update(dict)
        return self

    def delete(self):
        if(self.notebook_id is None): 
            return
        ref = database.collection("pt_notebooks").document(self.notebook_id).collection("contents")
        ref.document(self.id).delete()
        return True