# Questions
On excercises, Questions allow for user input and data validation, making them interactive and augmenting the learning experience. The implementation is designed **flexibility**, **customizability** and **security** in mind. 

## `PTQuestion` object
All questions are normalized into the following schema, with the properties:

### `type: String`
Specifies the question's type. The rendering and validation tests depend on this value. 

**Types**:
| Type | Description |
| ---- | ----------- |
| PTQuestion.checkbox | Learners select from a list of choice in which one or more may be valid |
| PTQuestion.multipleChoice | Learners select only one answer from a list of choices. These can be reordered or shuffled. In future versions, an _other_ option can be configured to display an additional input |
| PTQuestion.number | Learners input a number (integers, fractions, constants). A tolerance options is provided, as well as min and max allowed values |
| PTQuestion.math | A mathematical expression is entered and compared symbolically using [KAS](https://github.com/Khan/KAS) | 
| PTQuestion.function | A mathematical function is entered and evaluated to a set of variables using [KAS](https://github.com/Khan/KAS) to see if the function outputs the expected values within a certain range |

### `description: String`
Text to be shown alongside the question input, such as instructions. 

### `showAnswer: String`
Determines when and if to show the answer to learners

### `attempts: Number`
Maximum number of allowed attempts

### `attemptPenalization: Number`
For questions with multiple attempts, indicates the **percentage** penalization on score per incorrect attempt.

### `score: Number`
Indicates the maximum possible score to be awarded when the question is answered correctly (assuming no penalization per incorrect attempts)

### `minValue: Number`
(PTQuestion.number). Minimum (inclusive) value the learner is allowed to enter on an input.

### `maxValue: Number`
(PTQuestion.number). Maximum (inclusive) value the learner is allowed to enter on an input. 

### `stepValue: Number`
(PTQuestion.number). Step value the learner is allowed to enter on an input (ie, range slider)

### `randomnize: Boolean`
(PTQuestion.checkbox, PTQuestion.multipleChoice). Determines if the order in which the choices are rendered should be random.

(PTQuestion.function). Determines if the order in which data points are rendered should be random. 

### `maxChoices: Number`
(PTQuestion.checkbox, PTQuestion.multipleChoice). Number of choices to be shown to the learner. Useful when having large amounts of choices, randomnized.

(PTQuestion.function). Number of data points to be shown to the learner. Useful when having large amounts of data points, randomnized.

### `choices: {id: String, type: String, value: String}[]`
(PTQuestion.checkbox, PTQuestion.multipleChoice). Choices to be shown

(PTQuestion.function). Data points 

> TODO: Consider changing name to allow for future extensibility. Proposal: data

### `rules: []`
Rules used to verify answers. 
> TODO: Define