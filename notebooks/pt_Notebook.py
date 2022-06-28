import json
from typing import Optional
from pydantic import NoneIsAllowedError
from pt_Firebase import database
from notebooks.pt_NotebookItem import pt_NotebookItem
from notebooks.pt_Question import pt_Question


def parse_notebook_item(item):
    if(isinstance(item, pt_NotebookItem)):
        return item
    if(item["type"] == "question"):
        return pt_Question(item)
    else:
        return pt_NotebookItem(item)

class pt_Notebook:
    @classmethod
    def read(cls, notebook_id: str, include_contents: Optional[bool] = True):
        # Document
        doc_ref = database.collection("pt_notebooks").document(notebook_id)
        doc = doc_ref.get()
        doc_dict = doc.to_dict()
        doc_dict["id"] = doc.id
        # Get contents
        """if(include_contents):
            doc_dict["contents"] = []
            contents = doc_ref.collection("contents").get()
            for content in contents:
                content_dict = content.to_dict()
                content_dict["id"] = content.id
                content_dict["notebook_id"] = doc.id
                # Parse and append
                doc_dict["contents"].append(parse_notebook_item(content_dict))
            doc_dict["contents"].sort(key=lambda x: x.display_index)
        return cls(doc_dict)"""
        nb = cls(doc_dict)
        if(include_contents):
            nb.get_contents()
        return nb

    @classmethod
    def read_by_author(cls, author_uid: str):
        data = []
        # Get documents
        docs = database.collection("pt_notebooks").where("author_uid", "==", author_uid).stream()
        for doc in docs:
            doc_dict = doc.to_dict()
            doc_dict["id"] = doc.id
            data.append( pt_Notebook(doc_dict) )
        return data

    id: str = ""
    title: str = ""
    contents: list[pt_NotebookItem] = []
    author_uid: str = ""
    protected: bool = False
    tags: list = []

    def __init__(self, data: dict) -> None:
        self.id = data.get("id", None)
        self.title = data.get("title", "")
        self.contents = list(map(lambda x: parse_notebook_item(x), data.get("contents", [])))
        self.author_uid = data.get("author_uid", "")
        self.tags = data.get("tags", [])

        self.contents.sort(key=lambda x: x.display_index)

    def to_dict(self):
        return {
            "id": self.id, 
            "title": self.title, 
            "contents": list(map(lambda x: x.to_dict(), self.contents)), 
            "author_uid": self.author_uid
        }

    def to_dict_protected(self):
        dict = {
            "id": self.id, 
            "title": self.title, 
            "contents": list(map(lambda x: x.to_dict_protected(), self.contents)), 
            "protected": True
        }
        return dict

    def update(self, new_data: dict):
        # Assign new values
        for key in new_data:
            if(key != "id" and key != "contents" and key != "author_uid"):
                setattr(self, key, new_data[key])
        # Get reference
        ref = database.collection("pt_notebooks")
        # Convert to dict
        dict = self.to_dict()
        del dict["contents"]
        del dict["id"]
        # Updte or add
        if(self.id is None):
            new_doc = ref.add(dict)
            self.id = new_doc[1].id
        else:
            ref.document(self.id).set(dict)
        return self

    def delete(self):
        if(self.id is None):
            return
        doc = database.collection("pt_notebooks").document(self.id)
        doc.delete()
        for content in self.contents:
            content.delete()
        return True

    def add_content(self, type: str):
        content_dict = {
            "id": None, 
            "notebook_id": self.id, 
            "display_index": len(self.contents), 
            "type": type or "text"
        }
        content = None
        if(content_dict["type"] == "text"):
            content = pt_NotebookItem(content_dict)
        if(content_dict["type"] == "question"):
            content = pt_Question(content_dict)
        content.update({})
        return content

    def get_contents(self):
        contents = database.collection("pt_notebooks").document(self.id).collection("contents").get()
        for content in contents:
            content_dict = content.to_dict()
            content_dict["id"] = content.id
            content_dict["notebook_id"] = self.id
            # Parse and append
            self.contents.append(parse_notebook_item(content_dict))
        self.contents.sort(key=lambda x: x.display_index)
        