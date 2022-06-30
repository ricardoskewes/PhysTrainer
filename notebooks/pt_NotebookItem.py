import json
from pt_Firebase import database
from pt_DBCache import cache

class pt_NotebookItem:
    @classmethod
    def read(cls, notebook_id: str, item_id: str):
        # Get from cache
        """cached = cache.collection("pt_notebookitems").get_data(notebook_id+"/"+item_id)
        if(cached is not None):
            return cached"""
        # Get item reference
        item_ref = database.collection("pt_notebooks").document(notebook_id).collection("contents").document(item_id)
        item = item_ref.get()
        item_dict = item.to_dict()
        item_dict["id"] = item.id
        item_dict["creation_date"] = item.create_time
        # Create object and tore in cache
        obj = cls(item_dict)
        cached = cache.collection("pt_notebookitems").add_data(notebook_id+"/"+item_id, obj)
        return obj

    id: str = ""
    notebook_id: str = ""
    display_index: int = 0
    type: str = ""
    text: str = ""
    creation_date = None

    def __init__(self, data: dict) -> None:
        self.id = data.get("id", None)
        self.notebook_id = data.get("notebook_id", None)
        self.display_index = data.get("display_index", 0)
        self.type = data.get("type", "text")
        self.text = data.get("text", "")
        self.creation_date = data.get("creation_date", None)

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
            new_doc = ref.add(dict)
            self.id = new_doc[1].id
        else:
            ref.document(self.id).update(dict)
        # Update in cache
        cache.collection("pt_notebookitems").add_data(self.notebook_id+"/"+self.id, self)
        return self

    def delete(self):
        if(self.notebook_id is None): 
            return
        ref = database.collection("pt_notebooks").document(self.notebook_id).collection("contents")
        ref.document(self.id).delete()
        # Delete in cache
        cache.collection("pt_notebookitems").remove_data(self.notebook_id+"/"+self.id, self)
        return True