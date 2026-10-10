import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { USERS } from '../lib/users';

export default function UserSelect() {
  const navigate = useNavigate();

  return (
    <div className="page user-select-page">
      <motion.h1
        className="app-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📚 たんごちょう
      </motion.h1>
      <motion.p
        className="app-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        だれの単語帳をひらく？
      </motion.p>

      <div className="user-grid">
        {USERS.map((user, i) => (
          <motion.button
            key={user.id}
            className="user-card"
            style={{ '--accent': user.accent }}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.12, type: 'spring', stiffness: 200, damping: 18 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate(`/vocab/${user.id}`)}
          >
            <span className="user-emoji">{user.emoji}</span>
            <span className="user-name">{user.name}</span>
            <span className="user-cta">単語帳をひらく →</span>
          </motion.button>
        ))}
      </div>

      <motion.button
        className="quiz-entry-btn"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/quiz')}
      >
        🎯 出題モードへ
      </motion.button>
    </div>
  );
}
