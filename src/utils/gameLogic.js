export const generateQuestion = (level = 1) => {
    // Seviye arttıkça sayı aralığını genişlet ama her zaman karışık sor
    // Level 1: 2-5 arası (Max çarpım 25)
    // Level 5: 2-9 arası (Max çarpım 81)
    // Level 10+: 3-12 arası

    let minNum = 2;
    let maxNum = Math.min(5 + Math.floor(level * 0.8), 12);

    // Arada sırada kolay (2, 5, 10 ile çarpım) veya zor soru sorma şansı
    if (level > 2 && Math.random() < 0.3) {
        maxNum += 2; // Zorluk sıçraması
    }

    const num1 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    const num2 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;

    const correctAnswer = num1 * num2;

    const wrongAnswers = [];
    while (wrongAnswers.length < 2) {
        // Yanlış cevaplar doğru cevaba yakın olmalı (şaşırtmalı)
        const range = Math.max(5, Math.floor(correctAnswer * 0.3));
        const offset = Math.floor(Math.random() * (range * 2)) - range;
        const wrong = correctAnswer + offset;

        if (wrong !== correctAnswer && wrong > 0 && !wrongAnswers.includes(wrong)) {
            wrongAnswers.push(wrong);
        }
    }

    const allAnswers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

    return { num1, num2, correctAnswer, answers: allAnswers };
};
