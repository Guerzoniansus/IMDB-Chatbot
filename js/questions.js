class Question {

    /**
     * Creates a question
     * @param question The full question
     * @param keywords The keywords to match the question
     * @param answers An array of answers to this question, which can be text, an image, or multiple of both
     */
    constructor(question, keywords, answers) {
        this.question = question;
        this.keywords = keywords;
        this.answers = answers;
    }

    /**
     * Given a sentence, this function checks how many words in that sentence matches with this question's keywords
     * @param sentence The sentence to compare to this question's keywords
     * @returns {number} The amount of keywords that match with the given sentence
     */
    checkHowManyKeywordsMatch(sentence) {
        const words = sentence.toLowerCase().split(" ");
        let n = 0;

        words.forEach((word) => {
            if (this.keywords.includes(word))
                n++;
        });

        return n;
    }
}

class Answer {

    /**
     * Creates an answer for a question
     * @param type Either "text" or "image"
     * @param content A string when type == text, or an image url if type == image
     */
    constructor(type, content) {
        this.type = type;
        this.content = content;
    }
}

/*
Each question has:
question: The full question that will be shown on screen
keywords: An array of keywords
 */

/**
 * QUESTIONS is an array of Question objects.
 * Each question has:
 * question - The full question that will be shown on screen
 * keywords - An array of keywords to match an input with this question
 * answers - An array of Answer objects
 * @type {Question[]}
 */
export const QUESTIONS = [

    new Question("Welk filmgenre heeft gemiddeld de hoogste rating?",
        ["genre", "filmgenre", "rating", "hoogste", "beste", "beoordeling"],
        [ new Answer("sql", "1") ]
    ),

    new Question("Welke acteurs / actrices hebben in de meeste films gespeeld met een rating van een 9 of hoger?",
        ["acteur", "actrice", "acteurs", "actrices", "meeste", "film", "films", "gespeeld", "rating", "waardeering", "review", "van", "9", "hoger", "9.0"],
        [ new Answer("sql", "2") ]
    ),

    new Question("Welke acteur/actrice heeft in de meeste films geacteerd die onder het hoogst gewaardeerde genre valt?",
        ["acteur", "actrice", "acteurs", "actrices", "heeft", "meeste", "hoogst", "aantal", "films", "geacteerd", "gespeeld", "speelt", "hoogst",
        "gewardeerde", "rating", "genre", "valt", "tellen"],
        [ new Answer("sql", "3") ]
    ),

    new Question("Welk filmgenre heeft gemiddeld het hoogste budget?",
        [ "welk", "filmgenre", "film", "genre", "heeft", "gemiddeld", "hoogste", "budget"],
        [ new Answer("sql", "4") ]
    ),

    new Question("Welk filmgenre heeft in verhouding het minste budget nodig voor de hoogste rating?",
        [ "welk", "filmgenre", "film", "genre", "heeft", "verhouding", "minste", "laagste", "budget", "nodig", "voor", "hoogste", "rating", "waardeering" ],
        [ new Answer("sql", "5") ]
    )
];




