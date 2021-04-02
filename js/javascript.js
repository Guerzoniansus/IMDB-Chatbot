import { QUESTIONS} from "./questions.js";

const DB_URL = "http://localhost:8080";

const INPUT_FIELD = document.getElementById("question-input");
const MESSAGE_BOX = document.getElementById("message-container");

const QUESTION_DISPLAY = document.getElementById("question-display");
const ANSWER_OUTPUT = document.getElementById("output-answer-container");

const ANSWER_TEXT_FORMAT = (text) => `<p class="answer-text">${text}</p>`;
const ANSWER_IMAGE_FORMAT = (path) => `<a target="_blank" href="${path}"><img class="answer-image" src="${path}"></a>`;

const BOT = "IMDB-Bot";
const USER = "Ik";
const MESSAGE = (sender, message) => "<p class='message'>" + sender + ": " + message + "</p>";

const GREETING = "Hallo.";

init();

function init() {
    INPUT_FIELD.addEventListener("keyup", function(e) {
        if (e.key == "Enter") {
            processQuestion();
        }
    });
}

function processQuestion() {
    // Show input in chat
    sendMessage(USER, INPUT_FIELD.value);

    // Get input
    const input = sanitizedQuestion(INPUT_FIELD.value);
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

    const question = QUESTIONS[bestMatch];
    clearOutput();
    processAnswer(question);

    sendMessage(BOT, "Alsjeblieft.");
}


function processAnswer(question) {
    const imagePath = "images/";

    QUESTION_DISPLAY.innerHTML = question.question;

    question.answers.forEach((answer) => {
        if (answer.type == "text") {
            addAnswerOutput(ANSWER_TEXT_FORMAT(answer.content));
        }

        else if (answer.type == "image") {
            addAnswerOutput(ANSWER_IMAGE_FORMAT(imagePath + answer.content));
        }

        else if (answer.type == "sql") {

            $.get(DB_URL, {question: answer.content}, (data, status) => {
                if (status == "success") {
                    addAnswerOutput(ANSWER_TEXT_FORMAT(data));
                }

            }).fail(() => {
                addAnswerOutput(ANSWER_TEXT_FORMAT("Error: Het is niet gelukt om te verbinden met de database"));
            });

        }
    });

}

function sendMessage(sender, message) {
    MESSAGE_BOX.innerHTML = MESSAGE(sender, message) + MESSAGE_BOX.innerHTML;
}

function addAnswerOutput(output) {
    ANSWER_OUTPUT.innerHTML += output;
}

function clearOutput() {
    QUESTION_DISPLAY.innerHTML = "";
    ANSWER_OUTPUT.innerHTML = "";
}


function showHelp() {
    sendMessage(BOT, "Dit zijn de vragen die ik kan beantwoorden:");

    const divider = "--------------------------------------";
    sendMessage(BOT, divider);

    QUESTIONS.forEach((question) => {
        sendMessage(BOT, "- " + question.question);
    });

    sendMessage(BOT, divider);
}

function clearInputField() {
    INPUT_FIELD.value = "";
}

const sanitizedQuestion = (question) => {
    let sanitized = question.toLowerCase();

    // Remove question marks
    sanitized = sanitized.replace(/[?]/g,"");

    return sanitized;
};

function containsGreeting(input) {
    const greetings = ["hey", "hallo", "hello", "hoi", "goedemiddag", "goededag"];
    return greetings.includes(input);
}