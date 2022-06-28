# Text dependencies
from latex2sympy2 import latex2sympy
import sympy
from quantulum3 import parser
import string
import spacy
import json
nlp = spacy.load("en_core_web_sm")

########################
######### TEXT #########
########################

def pt_comparison_text_strict(submission: str, answer: str) -> bool:
    return submission == answer

def pt_comparison_text_medium(submission: str, answer: str) -> bool:
    def __medium_transform(s: str) -> str:
        return s.lower().translate(str.maketrans(dict.fromkeys(string.punctuation)))
    return __medium_transform(submission) == __medium_transform(answer)

def pt_comparison_text_similarity(submission: str, answer: str) -> bool:
    return nlp(answer).similarity(nlp(submission)) >= 0.8

########################
######### NUMS #########
########################

def pt_comparison_num_strict(submission: str, answer: str) -> bool:
    submission_expr = parser.parse(submission)
    answer_expr = parser.parse(answer)
    # Check if two scalars are equal
    # TODO: Verify if comparison should be done using the uncertainty values
    #       from submission and answer
    if(submission_expr[0].value != answer_expr[0].value):
        return False
    # Check if units are equal
    if(submission_expr[0].unit.name != answer_expr[0].unit.name):
        return False
    return True

########################
######### MATH #########
########################

def pt_comparison_math_equality(submission: str, answer: str) -> bool:
    submission_expr = latex2sympy(submission)
    answer_expr = latex2sympy(answer)
    return submission_expr.equals(answer_expr)

########################
######### OPTS #########
########################

def pt_comparison_options_all(submission: str, answer: str) -> bool:
    submission_arr = json.loads(submission)
    answer_arr = json.loads(answer)
    for option in answer_arr:
        if(submission_arr.count(option) <= 0):
            return False
    return True 

def pt_comparison_options_some(submission: str, answer: str) -> bool:
    submission_arr = json.loads(submission)
    answer_arr = json.loads(answer)
    for option in submission_arr:
        if(answer_arr.count(option) <= 0):
            return False
    return True 