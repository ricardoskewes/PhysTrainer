## Checkbox problem
Gives a list of options in which 1+ are valid.

## Multiple choice
In multiple choice questions, learners select one option from a list of answer options.
Multiple choice questions can also have several advanced options, such as reordering, or shuffling, the set of answer choices for each learner.

Multiple choice questions can be represented as a list of multiple choices, or a dropdown menu, or a combo box for big lists of options. 

### Multiple choice extended
Optionally, an _other_ choice can be added with a specified type of input (numerical, text, etc.)

## Numerical input
In numerical input questions, learners enter integers, fractions or constants (_pi_, _e_, _g_). A tolerance parameter is provided so that learners’ responses do not have to be exact.

Numerical input questions can be represented as an input box or a slider (min, max values should be provided)

## Text input
Learners enter text into a response field. The response can include numbers, letters, and special
characters such as punctuation marks. It is recommended to have more than one correct answer to allow for differences in capitalization and typographical errors.

## Symbolic input
Learners enter a mathematical formulae in a textbox using plain text math or LaTeX. Answers are compared using [KAS](https://github.com/Khan/KAS) to allow for differences in format while ensuring the learner's input matches the expected expression.

## Data points prediction input
Given a list of example points, learners should enter a mathematical function that best describes said points within a tolerance range. The formula will be parsed using [KAS](https://github.com/Khan/KAS) and compared with such values. Like multiple choice questions, example points can be reordered or shuffled. 

# References
OXL https://buildmedia.readthedocs.org/media/pdf/edx-open-learning-xml/latest/edx-open-learning-xml.pdf
GIFT https://docs.moodle.org/311/en/GIFT_format
Moodle XML https://docs.moodle.org/311/en/Moodle_XML_format
JSON Quiz http://json-quiz.github.io/json-quiz/spec/base-question.html