import { Link, useLocation } from 'react-router-dom';

export default function NavBar({ user }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        📚 たんごちょう
      </Link>
      <div className="nav-links">
        {user && (
          <Link
            to={`/vocab/${user.id}`}
            className={`nav-link ${location.pathname === `/vocab/${user.id}` ? 'active' : ''}`}
          >
            {user.emoji} {user.name}の単語帳
          </Link>
        )}
        <Link to="/quiz" className={`nav-link ${location.pathname === '/quiz' ? 'active' : ''}`}>
          🎯 出題モード
        </Link>
      </div>
    </nav>
  );
}
