import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
// Задача 1. У консольний додаток передають через параметр пенсійний вік. Наприклад
// node app.mjs –-pension=65
// Потім питаємо у терміналі користувача скільки йому років (використати “readline”) і кажемо чи він є пенсіонером.

//===========================================================

function getRetirementAnswer(pensionerAge, userAge) {
    return pensionerAge >= userAge ? "You are not of pension age yet" : "You are of pension age";
}

//===========================================================
function getRetirementAge() {
    const paramsList = process.argv.slice(2).join("&");
    const args = new URLSearchParams(paramsList);
    return parseInt(args.get("--pension"));
}

// Варіант перший, простий
function askQuestionsSimple() {
    console.log("Hello, this app checks your age, please enter your age");
    rl.question("Your age", (answerAge) => {
        const userAge = parseInt(answerAge);
        if (userAge > 100) {
            console.error("This age is incorrect, Please enter correct age!");
            rl.close();
        }
        const pensionerAge = getRetirementAge();
        console.log(getRetirementAnswer(pensionerAge, userAge));
        rl.close();
    });
}
askQuestionsSimple();

// Варіант другій з циклом

async function askQuestions() {
    const questions = ["Please enter your age"];
    const answerArr = [];
    console.log("Hello, this app checks your age, please enter your age");
    for (const question of questions) {
        try {
            const answer = await new Promise((resolve, reject) => {
                rl.question(question, (answer) => {
                    if (parseInt(answer) > 100) {
                        reject("This age is incorrect, Please enter correct age!");
                    }
                    resolve(answer);
                });
            });
            answerArr.push(answer);
        } catch (error) {
            console.error(error);
            rl.close();
            break;
        }
    }
    console.log(getRetirementAnswer(getRetirementAge(), ...answerArr));
    rl.close();
}

askQuestions();

rl.on("SIGINT", () => {
    rl.question("Do you want exit app (y or n)", (answer) => {
        if (answer.match(/^y(es)?$/i)) {
            rl.pause();
        }
    });
});
