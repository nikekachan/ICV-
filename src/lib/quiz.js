import { getVocabList } from './storage';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// direction: 'random' | 'word-to-meaning' | 'meaning-to-word'
export function buildQuiz(userId, { direction = 'random', count = 10 } = {}) {
  const list = getVocabList(userId);
  if (list.length < 3) return [];

  const pool = shuffle(list);
  const questions = [];

  for (const item of pool) {
    if (questions.length >= count) break;

    const dir =
      direction === 'random' ? (Math.random() < 0.5 ? 'word-to-meaning' : 'meaning-to-word') : direction;
    const answerField = dir === 'word-to-meaning' ? 'meaning' : 'word';
    const promptField = dir === 'word-to-meaning' ? 'word' : 'meaning';
    const correctAnswer = item[answerField];

    const distractorPool = [
      ...new Set(
        list.filter((v) => v.id !== item.id && v[answerField] !== correctAnswer).map((v) => v[answerField])
      ),
    ];
    if (distractorPool.length < 2) continue;

    const distractors = shuffle(distractorPool).slice(0, 2);
    const choices = shuffle([correctAnswer, ...distractors]);

    questions.push({
      id: item.id,
      direction: dir,
      prompt: item[promptField],
      answer: correctAnswer,
      choices,
    });
  }

  return questions;
}
