import { generateQuestion as simpleMultiplication } from './gameLogic';

// Division Generator
const generateDivision = (level) => {
    // Level 1: Divisors 2-5, Quotient 2-5. (e.g. 10 / 2 = 5)
    // Level 2: Divisors 2-9, Quotient 2-9.

    let minNum = 2;
    let maxNum = level === 1 ? 5 : 9;

    const divisor = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    const quotient = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    const dividend = divisor * quotient;

    const correctAnswer = quotient;
    const wrongAnswers = [];

    while (wrongAnswers.length < 2) {
        const range = Math.max(3, Math.floor(correctAnswer * 0.5));
        const offset = Math.floor(Math.random() * (range * 2)) - range;
        const wrong = correctAnswer + offset;

        if (wrong !== correctAnswer && wrong > 0 && !wrongAnswers.includes(wrong)) {
            wrongAnswers.push(wrong);
        }
    }

    // Ensure we have correct answer type (number)
    const answers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

    return {
        num1: dividend,
        num2: divisor,
        operator: '÷',
        correctAnswer,
        answers
    };
};

// Advanced Multiplication (2-Digit)
const generateAdvancedMultiplication = (level) => {
    // Level 1: 10-15 * 2-5
    // Level 2: 10-20 * 3-9

    let n1Min = 10, n1Max = level === 1 ? 15 : 20;
    let n2Min = level === 1 ? 2 : 3;
    let n2Max = level === 1 ? 5 : 9;

    const num1 = Math.floor(Math.random() * (n1Max - n1Min + 1)) + n1Min;
    const num2 = Math.floor(Math.random() * (n2Max - n2Min + 1)) + n2Min;

    const correctAnswer = num1 * num2;
    const wrongAnswers = [];

    while (wrongAnswers.length < 2) {
        const range = Math.max(10, Math.floor(correctAnswer * 0.2));
        const offset = Math.floor(Math.random() * (range * 2)) - range;
        const wrong = correctAnswer + offset;

        // Make sure wrong answer has same last digit often to be tricky? Maybe later.
        if (wrong !== correctAnswer && wrong > 0 && !wrongAnswers.includes(wrong)) {
            wrongAnswers.push(wrong);
        }
    }

    const answers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

    return {
        num1,
        num2,
        operator: '×',
        correctAnswer,
        answers
    };
};

export const QuestionEngine = {
    generate: (config) => {
        const { type, level } = config || { type: 'multiplication', level: 1 };

        switch (type) {
            case 'division':
                return generateDivision(level);
            case 'advanced_mult':
                return generateAdvancedMultiplication(level);
            case 'multiplication':
            default:
                // Adapt existing simple multiplication to match the new object format with 'operator'
                const q = simpleMultiplication(level);
                return { ...q, operator: '×' };
        }
    }
};
