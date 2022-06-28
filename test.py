from pt_Notebook.pt_Question import pt_Question
from pt_Notebook.pt_Notebook import pt_Notebook

"""q = pt_Question.read(notebook_id="khTLio47iuFMEFK6E6Yf", item_id="Yrzj08GRA2m2gjfKwYKk")
print(q.to_dict())"""

# Get a notebook
notebook = pt_Notebook.read(notebook_id="khTLio47iuFMEFK6E6Yf")
# Get first question 
for item in notebook.contents:
    print(item.text)
    if(item.type == "question"):
        ans = input("> ")
        print(item.verify_submission(ans))