## PTQuestion.checkbox
Gives a list of options in which 1+ are valid.

## PTQuestion.multipleChoice
Learnes select only ONE option from a list. The choices can also be reordered or shuffled. 
> In future versions, an _other_ option can be configured to display an input

### PTQuestion.multipleChoice.radio
Shows the options as a list of radio buttons

### PTQuestion.multipleChoice.dropdown
(Under development) Shows the options inside a dropdown menu

### PTQuestion.multipleChoice.comboBox
(Under development) Shows the options as a combobox with input for searching


## PTQuestion.number
In numerical input questions, learners enter integers, fractions or constants (_pi_, _e_, _g_). A tolerance option is provided so that learners’ responses do not have to be exact. Additionally, min and max options can be configured as hints for the learner. 

### PTQuestion.number.input
Shows an input in which to type the correct value

### PTQuestion.number.slider
Shows a slider to specify the correct value. min and max options must be set.

## PTQuestion.text
Learners enter text into a response field. The response can include numbers, letters, and special
characters such as punctuation marks. It is recommended to have more than one correct answer to allow for differences in capitalization and typographical errors.

## PTQuestion.math
Learners enter a mathematical expression in a textbox using MathML or LaTeX. Answers are compared symbolically using [KAS](https://github.com/Khan/KAS)

## PTQuestion.function
Learners enter a mathematical function. The function is evaluated using [KAS](https://github.com/Khan/KAS) against input variables to see if the function outputs the expected value within a certain range.

# References
OXL https://buildmedia.readthedocs.org/media/pdf/edx-open-learning-xml/latest/edx-open-learning-xml.pdf
GIFT https://docs.moodle.org/311/en/GIFT_format
Moodle XML https://docs.moodle.org/311/en/Moodle_XML_format
JSON Quiz http://json-quiz.github.io/json-quiz/spec/base-question.html