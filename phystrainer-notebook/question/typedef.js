/**
 * Defines a question choice in Phystrainer
 * @typedef {object} PTQuestionChoice schema
 * @property {number} choiceID Unique identifier for each choice
 * @property {string} choice Raw content of the choice
 */

/**
 * Defines a question object in Phystrainer
 * @typedef {object} PTQuestion schema
 * @property {string} text Text to be shown alongside the question
 * @property {number} [maximumAttempts=1] Maximum number of attempts before the question is unavailable
 * @property {number} [attemptPenalization=1] Penalization on the question's score per incorrect attempt
 * @property {number} [maxScore=1] Maximum possible score to be obtained if question is answered correctly
 * @property {array.<PTQuestionChoice>} [choices] Describes the available choices for the question
 * @property {boolean} [randomChoices=false] Indicates whether shown options should be randomnized
 * @property {number} [maxChoices=3] Maximum number of choices to be shown
 * @property {"always"|"answered"|"attempted"|"closed"|"correct_or_past_due"|"finished"|"past_due"|"never"} [showAnswer="answered"] Determines when and if to show the answer
 * @property {string} type Specifies the question's type
 * @property {array} validation Rules for validation of correct answer. These may vary according to the type of question
 */

export {}