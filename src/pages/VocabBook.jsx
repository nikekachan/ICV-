import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import NavBar from '../components/NavBar';
import VocabForm from '../components/VocabForm';
import VocabCard from '../components/VocabCard';
import { getUser } from '../lib/users';
import { fetchVocabList, addVocab, updateVocab, deleteVocab } from '../lib/api';

export default function VocabBook() {
  const { userId } = useParams();
  const user = getUser(userId);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [query, setQuery] = useState('');

  const load = useCallback(() => {
    if (!user) return;
    setLoading(true);
    setError('');
    fetchVocabList(user.id)
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((v) => v.word.toLowerCase().includes(q) || v.meaning.toLowerCase().includes(q));
  }, [list, query]);

  if (!user) return <Navigate to="/" replace />;

  async function handleAddOrUpdate(word, meaning) {
    setError('');
    try {
      if (editingItem) {
        setList(await updateVocab(user.id, editingItem.id, word, meaning));
        setEditingItem(null);
      } else {
        setList(await addVocab(user.id, word, meaning));
      }
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(id) {
    setError('');
    try {
      setList(await deleteVocab(user.id, id));
      if (editingItem?.id === id) setEditingItem(null);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="page" style={{ '--accent': user.accent }}>
      <NavBar user={user} />
      <header className="book-header">
        <h1>
          {user.emoji} {user.name}の単語帳
        </h1>
        <p className="book-count">{loading ? '読み込み中…' : `${list.length}個の単語`}</p>
      </header>

      <VocabForm onSubmit={handleAddOrUpdate} editingItem={editingItem} onCancelEdit={() => setEditingItem(null)} />

      {error && (
        <p className="error-message">
          {error} <button className="retry-link" onClick={load}>再読み込み</button>
        </p>
      )}

      {list.length > 3 && (
        <input
          className="search-input"
          type="text"
          placeholder="🔍 検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}

      {loading ? (
        <motion.p className="empty-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          読み込み中…
        </motion.p>
      ) : filtered.length === 0 ? (
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
