export const USERS = [
  { id: 'kenta', name: '健太', emoji: '🦊', accent: '#ff9a5c' },
  { id: 'katsunii', name: 'かつにい', emoji: '🐻', accent: '#5c9aff' },
];

export function getUser(id) {
  return USERS.find((u) => u.id === id);
}
