import { HashRouter, Routes, Route } from 'react-router-dom';
import UserSelect from './pages/UserSelect';
import VocabBook from './pages/VocabBook';
import Quiz from './pages/Quiz';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<UserSelect />} />
        <Route path="/vocab/:userId" element={<VocabBook />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="*" element={<UserSelect />} />
      </Routes>
    </HashRouter>
  );
}
