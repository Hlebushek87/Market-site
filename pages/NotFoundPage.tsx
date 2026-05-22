import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <h2>404 — Страница не найдена</h2>
      <Link to="/" className="btn btn-primary">
        На главную
      </Link>
    </div>
  );
}