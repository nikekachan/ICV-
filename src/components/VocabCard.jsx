import { motion } from 'framer-motion';

export default function VocabCard({ item, onEdit, onDelete }) {
  return (
    <motion.li
      className="vocab-card"
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 60, transition: { duration: 0.25 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
    >
      <div className="vocab-card-text">
        <p className="vocab-word">{item.word}</p>
        <p className="vocab-meaning">{item.meaning}</p>
      </div>
      <div className="vocab-card-actions">
        <button className="icon-btn" onClick={() => onEdit(item)} aria-label="編集">
          ✏️
        </button>
        <button className="icon-btn danger" onClick={() => onDelete(item.id)} aria-label="削除">
          🗑️
        </button>
      </div>
    </motion.li>
  );
}
