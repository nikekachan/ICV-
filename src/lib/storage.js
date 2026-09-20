const STORAGE_PREFIX = 'vocab_app_';

function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
}

export function getVocabList(userId) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + userId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveVocabList(userId, list) {
  localStorage.setItem(STORAGE_PREFIX + userId, JSON.stringify(list));
}

export function addVocab(userId, word, meaning) {
  const entry = { id: uid(), word, meaning };
  const next = [entry, ...getVocabList(userId)];
  saveVocabList(userId, next);
  return next;
}

export function updateVocab(userId, id, word, meaning) {
  const next = getVocabList(userId).map((v) => (v.id === id ? { ...v, word, meaning } : v));
  saveVocabList(userId, next);
  return next;
}

export function deleteVocab(userId, id) {
  const next = getVocabList(userId).filter((v) => v.id !== id);
  saveVocabList(userId, next);
  return next;
}
