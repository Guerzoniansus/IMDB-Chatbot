import { QUESTIONS} from "./questions.js";

const DB_URL = "http://localhost:8080";
const IMAGE_PATH = "images/";

const INPUT_FIELD = document.getElementById("question-input");
const MESSAGE_BOX = document.getElementById("message-container");

const QUESTION_DISPLAY = document.getElementById("question-display");
const ANSWER_OUTPUT = document.getElementById("output-answer-container");

/**
 * Format for text answers
 * @param text The text to display
 * @returns {string} A formatted HTML element with the text ready to add on the page
 * @constructor
 */
const ANSWER_TEXT_FORMAT = (text) => `<p class="answer-text">${text}</p>`;

/**
 * Format for image answers
 * @param path The image name
 * @returns {string} A formatted HTML element with the image in it ready to be added to the page
 */
const ANSWER_IMAGE_FORMAT = (path) => `<a target="_blank" href="${path}"><img class="answer-image" src="${path}"></a>`;

/**
 * A format for clickable questions in the chat box
 * @param question The question
 * @returns {string} A formatted HTML element for a clickable question
 */
const QUESTION_FORMAT = (question) => `➡ <span class="clickable-question" onclick="clickedQuestion(this.innerText)">${question}</span>`

const BOT = "IMDB-Bot";
const USER = "Ik";

/**
 * A format for chat message
 * @param sender The name of the sender
 * @param message The message that was sent
 * @returns {string} A formatted HTML element that can be added to the web page
 */
const MESSAGE = (sender, message) => "<p class='message'><b>" + sender + "</b>: " + message + "</p>";

const GREETING = "Hallo.";

init();


/**
 * Initialize stuff
 */
function init() {
    INPUT_FIELD.addEventListener("keyup", (e) => {
        if (e.key == "Enter") {
            handleInput();
        }
    });

    // This is needed because this javascript is imported as a module which means that
    // functions are not recognized in the global scope
    // which means that the HTML won't recognize the function when defined inside the HTML itself
    // (aka the onclick= part of the <span class=clickable-question>)
    // and using this line here fixes that
    window.clickedQuestion = clickedQuestion;
}

/**
 * Click event handler for clickable questions
 * @param question The queston that got clicked
 */
function clickedQuestion(question) {
    processQuestion(question);
}

/**
 * Handle user input
 */
function handleInput() {
    const input = sanitizedQuestion(INPUT_FIELD.value);
    processQuestion(input);
}

/**
 * Handle a question
 * @param input The input that needs to be checked for a question
 */
function processQuestion(input) {
    // Show input in chat
    sendMessage(USER, input);
    clearInputField();

    // Check if input is empty
    if (input == "")
        return;

    // Check for help
    if (input == "help") {
        showHelp();
        return;
    }

    // Check for greeting
    if (containsGreeting(input)) {
        sendMessage(BOT, GREETING);
        return;
    }

    // Check which question matches the most
    let bestMatch = -1;
    let bestMatchAmount = 0;

    for (let i = 0; i < QUESTIONS.length; i++) {
        const matchingWords = QUESTIONS[i].checkHowManyKeywordsMatch(input);

        if (matchingWords > bestMatchAmount) {
            bestMatch = i;
            bestMatchAmount = matchingWords;
        }
    }

    // -1 means no question matched
    if (bestMatch == -1) {
        sendMessage(BOT, "Sorry, deze vraag ken ik niet.");
        clearOutput();
        return;
    }

    // Answer the question
    const question = QUESTIONS[bestMatch];
    clearOutput();
    processAnswer(question);

    sendMessage(BOT, "Alsjeblieft.");
}

/**
 * Handle the answering process for a question
 * @param question The question to display the answer of
 */
function processAnswer(question) {
    QUESTION_DISPLAY.innerHTML = question.question;

    question.answers.forEach((answer) => {
        if (answer.type == "text") {
            addAnswerOutput(ANSWER_TEXT_FORMAT(answer.content));
        }

        else if (answer.type == "image") {
            addAnswerOutput(ANSWER_IMAGE_FORMAT(IMAGE_PATH + answer.content));
        }

        else if (answer.type == "sql") {

            addAnswerOutput("⌛ Antwoord aan het ophalen...")

            // Connect to backend server to retrieve which gets the answer from database
            $.get(DB_URL, {question: answer.content}, (data, status) => {
                if (status == "success") {
                    clearAnswers();
                    addAnswerOutput(ANSWER_TEXT_FORMAT(data));
                }

            }).fail(() => {
                addAnswerOutput(ANSWER_TEXT_FORMAT("Error: Het is niet gelukt om te verbinden met de database"));
            });

        }
    });

}

/**
 * Send a chat message
 * @param sender The name of the sender
 * @param message The message tos end
 */
function sendMessage(sender, message) {
    MESSAGE_BOX.innerHTML = MESSAGE(sender, message) + MESSAGE_BOX.innerHTML;
}

/**
 * Add an answer to the answer display output
 * @param output The output to display
 */
function addAnswerOutput(output) {
    ANSWER_OUTPUT.innerHTML += output;
}

/**
 * Clear answer output, including the shown question
 */
function clearOutput() {
    QUESTION_DISPLAY.innerHTML = "";
    clearAnswers();
}

/**
 * Clear only the answers part of the output
 */
function clearAnswers() {
    ANSWER_OUTPUT.innerHTML = "";
}

/**
 * Show the list of questions
 */
function showHelp() {
    sendMessage(BOT, "Dit zijn de vragen die ik kan beantwoorden:");

    QUESTIONS.forEach((question) => {
        sendMessage(BOT, QUESTION_FORMAT(question.question));
    });
}

/**
 * Clear the input field of the message box
 */
function clearInputField() {
    INPUT_FIELD.value = "";
}

/**
 * Cleans up a question for processing
 * @param question The question
 * @returns {string} The sanitized question
 */
const sanitizedQuestion = (question) => {
    let sanitized = question.toLowerCase();

    // Remove question marks
    sanitized = sanitized.replace(/[?]/g,"");

    return sanitized;
};

/**
 * Check of the input contains a greeting
 * @param input The input to analyze
 * @returns {boolean} True if it contains a greeting, false if it does not
 */
function containsGreeting(input) {
    const greetings = ["hey", "hallo", "hello", "hoi", "goedemiddag", "goededag"];
    return greetings.includes(input);
}