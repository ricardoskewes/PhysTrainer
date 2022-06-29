from notebooks.comparissons import *
from notebooks.pt_NotebookItem import pt_NotebookItem

########################
######## CLASS #########
########################

class pt_Question(pt_NotebookItem):
    
    id: str = ""
    text: str = ""
    comparison: str = ""
    __answer: str = ""
    display_options: dict = ""
    display_index: int = 0

    def __init__(self, data: dict) -> None:
        pt_NotebookItem.__init__(self, data)
        self.comparison = data.get("comparison", "pt_comparison_text_strict")
        self.__answer = data.get("answer", "")
        self.display_options = data.get("display_options", {})

    def to_dict(self):
        dict = super().to_dict()
        dict["comparison"] = self.comparison
        dict["display_options"] = self.display_options
        dict["answer"] = self.__answer
        return dict

    def to_dict_protected(self):
        dict = super().to_dict_protected()
        del dict["answer"]
        return dict

    def verify_submission(self, submission: str) -> bool:
        if(self.comparison == "pt_comparison_text_strict"):
            return pt_comparison_text_strict(submission, self.__answer)
        if(self.comparison == "pt_comparison_text_medium"):
            return pt_comparison_text_medium(submission, self.__answer)
        if(self.comparison == "pt_comparison_text_similarity"):
            return pt_comparison_text_similarity(submission, self.__answer)
        if(self.comparison == "pt_comparison_num_strict"):
            return pt_comparison_num_strict(submission, self.__answer)
        if(self.comparison == "pt_comparison_math_equality"):
            return pt_comparison_math_equality(submission, self.__answer)
        if(self.comparison == "pt_comparison_options_all"):
            return pt_comparison_options_all(submission, self.__answer)
        if(self.comparison == "pt_comparison_options_some"):
            return pt_comparison_options_some(submission, self.__answer)
        return False

    def set_answer(self, answer: str):
        self.__answer = answer
    
    def update(self, new_data: dict):
        if("answer" in new_data):
            self.set_answer(new_data["answer"])
        return super().update(new_data)