import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from '../components/NavBar';
import { USERS } from '../lib/users';
import { buildQuiz } from '../lib/quiz';

const DIRECTIONS = [
  { id: 'random', label: 'ランダム' },
  { id: 'word-to-meaning', label: '単語 → 意味' },
  { id: 'meaning-to-word', label: '意味 → 単語' },
];

const QUESTION_COUNT = 10;

export default function Quiz() {
  const [stage, setStage] = useState('setup'); // 'setup' | 'playing' | 'result'
  const [sourceId, setSourceId] = useState(USERS[0].id);
  const [direction, setDirection] = useState('random');
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');

  function startQuiz() {
    const qs = buildQuiz(sourceId, { direction, count: QUESTION_COUNT });
    if (qs.length === 0) {
      setError('出題するには、単語を3つ以上登録してください。');
      return;
    }
    setError('');
    setQuestions(qs);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setFeedback(null);
    setStage('playing');
  }

  function handleChoice(choice) {
    if (selected) return;
    const current = questions[index];
    const isCorrect = choice === current.answer;
    setSelected(choice);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      if (index + 1 < questions.length) {
        setIndex((i) => i + 1);
        setSelected(null);
        setFeedback(null);
      } else {
        setStage('result');
      }
    }, 900);
  }

  const current = questions[index];

  return (
    <div className="page">
      <NavBar />
      <header className="quiz-header">
        <h1>🎯 出題モード</h1>
      </header>

      <AnimatePresence mode="wait">
        {stage === 'setup' && (
          <motion.div
            key="setup"
            className="quiz-setup"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <div className="setup-group">
              <p className="setup-label">出題元</p>
              <div className="choice-row">
                {USERS.map((u) => (
                  <button
                    key={u.id}
                    className={`chip-btn ${sourceId === u.id ? 'active' : ''}`}
                    onClick={() => setSourceId(u.id)}
                  >
                    {u.emoji} {u.name}の単語帳
                  </button>
                ))}
              </div>
            </div>

            <div className="setup-group">
              <p className="setup-label">出題形式</p>
              <div className="choice-row">
                {DIRECTIONS.map((d) => (
                  <button
                    key={d.id}
                    className={`chip-btn ${direction === d.id ? 'active' : ''}`}
                    onClick={() => setDirection(d.id)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            <motion.button
              className="primary-btn start-btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={startQuiz}
            >
              クイズをはじめる
            </motion.button>
          </motion.div>
        )}

        {stage === 'playing' && current && (
          <motion.div
            key={`q-${index}`}
            className="quiz-play"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <p className="quiz-progress">
              {index + 1} / {questions.length}問
            </p>

            <motion.div
              className={`prompt-card ${feedback ?? ''}`}
              animate={
                feedback === 'wrong'
                  ? { x: [0, -10, 10, -8, 8, 0] }
                  : feedback === 'correct'
                    ? { scale: [1, 1.08, 1] }
                    : {}
              }
              transition={{ duration: 0.4 }}
            >
              {current.prompt}
            </motion.div>

            <div className="choice-grid">
              {current.choices.map((choice) => {
                const isSelected = selected === choice;
                const isAnswer = choice === current.answer;
                let stateClass = '';
                if (selected) {
                  if (isAnswer) stateClass = 'correct';
                  else if (isSelected) stateClass = 'wrong';
                }
                return (
                  <motion.button
                    key={choice}
                    className={`choice-btn ${stateClass}`}
                    disabled={!!selected}
                    whileHover={!selected ? { scale: 1.03 } : {}}
                    whileTap={!selected ? { scale: 0.97 } : {}}
                    onClick={() => handleChoice(choice)}
                  >
                    {choice}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {feedback && (
                <motion.p
                  className={`feedback-text ${feedback}`}
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {feedback === 'correct' ? '⭕ せいかい！' : `❌ ざんねん… 正解は「${current.answer}」`}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {stage === 'result' && (
          <motion.div
            key="result"
            className="quiz-result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 16 }}
          >
            <p className="result-emoji">
              {score === questions.length ? '🏆' : score >= questions.length / 2 ? '🎉' : '📖'}
            </p>
            <h2>結果発表</h2>
            <p className="result-score">
              {score} / {questions.length}問 正解
            </p>
            <div className="result-actions">
              <button className="primary-btn" onClick={startQuiz}>
                もう一度
              </button>
              <button className="ghost-btn" onClick={() => setStage('setup')}>
                設定を変える
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
