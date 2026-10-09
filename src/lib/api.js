const GAS_URL = import.meta.env.VITE_GAS_URL;

function ensureConfigured() {
  if (!GAS_URL) {
    throw new Error('GASのURLが設定されていません（環境変数 VITE_GAS_URL）。README.mdの手順を確認してください。');
  }
}

async function get(userId) {
  ensureConfigured();
  const url = new URL(GAS_URL);
  url.searchParams.set('userId', userId);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('サーバーに接続できませんでした');
  return res.json();
}

async function post(payload) {
  ensureConfigured();
  const res = await fetch(GAS_URL, {
    method: 'POST',
    // text/plain avoids a CORS preflight that Google Apps Script web apps don't handle
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('サーバーに接続できませんでした');
  return res.json();
}

function unwrap(data) {
  if (data.error) throw new Error(data.error);
  return data.list;
}

export async function fetchVocabList(userId) {
  return unwrap(await get(userId));
}

export async function addVocab(userId, word, meaning) {
  return unwrap(await post({ action: 'add', userId, word, meaning }));
}

export async function updateVocab(userId, id, word, meaning) {
  return unwrap(await post({ action: 'update', userId, id, word, meaning }));
}

export async function deleteVocab(userId, id) {
  return unwrap(await post({ action: 'delete', userId, id }));
}
