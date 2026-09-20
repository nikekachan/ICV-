import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function VocabForm({ onSubmit, editingItem, onCancelEdit }) {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');

  useEffect(() => {
    if (editingItem) {
      setWord(editingItem.word);
      setMeaning(editingItem.meaning);
    } else {
      setWord('');
      setMeaning('');
    }
  }, [editingItem]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!word.trim() || !meaning.trim()) return;
    onSubmit(word.trim(), meaning.trim());
    if (!editingItem) {
      setWord('');
      setMeaning('');
    }
  }

  return (
    <motion.form className="vocab-form" onSubmit={handleSubmit} layout>
      <div className="form-row">
        <input type="text" placeholder="単語・文" value={word} onChange={(e) => setWord(e.target.value)} />
        <input type="text" placeholder="意味" value={meaning} onChange={(e) => setMeaning(e.target.value)} />
      </div>
      <div className="form-actions">
        <button type="submit" className="primary-btn">
          {editingItem ? '更新する' : '＋ 登録する'}
        </button>
        {editingItem && (
          <button type="button" className="ghost-btn" onClick={onCancelEdit}>
            キャンセル
          </button>
        )}
      </div>
    </motion.form>
  );
}
