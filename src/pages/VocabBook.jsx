import { useState, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import NavBar from '../components/NavBar';
import VocabForm from '../components/VocabForm';
import VocabCard from '../components/VocabCard';
import { getUser } from '../lib/users';
import { getVocabList, addVocab, updateVocab, deleteVocab } from '../lib/storage';

export default function VocabBook() {
  const { userId } = useParams();
  const user = getUser(userId);
  const [list, setList] = useState(() => (user ? getVocabList(user.id) : []));
  const [editingItem, setEditingItem] = useState(null);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((v) => v.word.toLowerCase().includes(q) || v.meaning.toLowerCase().includes(q));
  }, [list, query]);

  if (!user) return <Navigate to="/" replace />;

  function handleAddOrUpdate(word, meaning) {
    if (editingItem) {
      setList(updateVocab(user.id, editingItem.id, word, meaning));
      setEditingItem(null);
    } else {
      setList(addVocab(user.id, word, meaning));
    }
  }

  function handleDelete(id) {
    setList(deleteVocab(user.id, id));
    if (editingItem?.id === id) setEditingItem(null);
  }

  return (
    <div className="page" style={{ '--accent': user.accent }}>
      <NavBar user={user} />
      <header className="book-header">
        <h1>
          {user.emoji} {user.name}の単語帳
        </h1>
        <p className="book-count">{list.length}個の単語</p>
      </header>

      <VocabForm onSubmit={handleAddOrUpdate} editingItem={editingItem} onCancelEdit={() => setEditingItem(null)} />

      {list.length > 3 && (
        <input
          className="search-input"
          type="text"
          placeholder="🔍 検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}

      {filtered.length === 0 ? (
        <motion.p className="empty-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {list.length === 0 ? 'まだ単語が登録されていません。上のフォームから追加しよう！' : '見つかりませんでした'}
        </motion.p>
      ) : (
        <ul className="vocab-list">
          <AnimatePresence>
            {filtered.map((item) => (
              <VocabCard key={item.id} item={item} onEdit={setEditingItem} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
