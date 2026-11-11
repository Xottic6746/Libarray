import { useMemo, useState } from 'react';
import { movies } from './data/movies';

function MovieCard({ movie, onSelect }) {
  return (
    <button
      type="button"
      className="movie-card"
      onClick={() => onSelect(movie)}
      aria-label={`View details for ${movie.title}`}
    >
      <div className="poster-wrap">
        <img className="poster" src={movie.poster} alt={movie.title} loading="lazy" />
        <span className="card-play" aria-hidden="true">▶</span>
      </div>
      <div className="card-info">
        <div className="card-meta">
          <span>{movie.genre}</span>
          <span>{movie.year}</span>
        </div>
        <h3>{movie.title}</h3>
        <p>{movie.runtime}</p>
      </div>
    </button>
  );
}

function MovieDialog({ movie, onClose }) {
  if (!movie) return null;

  return (
    <div
      className="dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="movie-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <button className="dialog-close" onClick={onClose} aria-label="Close movie details">
          ×
        </button>

        {movie.videoUrl ? (
          <video className="dialog-video" src={movie.videoUrl} controls autoPlay />
        ) : (
          <img className="dialog-poster" src={movie.poster} alt={movie.title} />
        )}

        <div className="dialog-content">
          <p className="eyebrow">
            {movie.genre} · {movie.year} · {movie.runtime}
          </p>
          <h2 id="dialog-title">{movie.title}</h2>
          <p className="dialog-description">{movie.description}</p>
          {!movie.videoUrl && (
            <p className="notice">
              Add a valid public video URL to this movie to enable streaming in the modal.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('All films');
  const [selectedMovie, setSelectedMovie] = useState(null);

  const genres = useMemo(
    () => ['All films', ...new Set(movies.map((movie) => movie.genre))],
    [],
  );

  const filteredMovies = useMemo(() => {
    const search = query.trim().toLowerCase();

    return movies.filter((movie) => {
      const matchesGenre = genre === 'All films' || movie.genre === genre;
      const matchesText =
        !search ||
        `${movie.title} ${movie.genre} ${movie.year} ${movie.description}`
          .toLowerCase()
          .includes(search);

      return matchesGenre && matchesText;
    });
  }, [query, genre]);

  const featured = movies[0];

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Libarray home">
          <span className="brand-mark">▶</span>
          <span>
            LIB<span className="brand-light">ARRAY</span>
          </span>
        </a>
        <a className="header-link" href="#catalog">
          Explore films <span>↓</span>
        </a>
      </header>

      <main id="top">
        {featured && (
          <section className="hero">
            <div className="hero-image" style={{ backgroundImage: `url("${featured.poster}")` }} />
            <div className="hero-shade" />

            <div className="hero-content">
              <p className="eyebrow">A free film collection</p>
              <h1>Stories worth sharing.</h1>
              <p className="hero-copy">
                Browse a public catalog of films and discover titles that are available to watch.
              </p>
              <button className="primary-button" onClick={() => setSelectedMovie(featured)}>
                <span aria-hidden="true">▶</span> Explore featured film
              </button>
            </div>

            <div className="hero-caption">
              <span>FEATURED</span>
              <strong>{featured.title}</strong>
              <span>{featured.year}</span>
            </div>
          </section>
        )}

        <section className="catalog-section" id="catalog">
          <div className="catalog-heading">
            <div>
              <p className="eyebrow">The collection</p>
              <h2>Find your next film</h2>
            </div>
            <span className="film-count">
              {filteredMovies.length} {filteredMovies.length === 1 ? 'film' : 'films'}
            </span>
          </div>

          <div className="catalog-tools">
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Search titles, genres, years..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search films"
              />
            </label>

            <div className="genre-list" aria-label="Filter by genre">
              {genres.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`genre-chip ${genre === item ? 'active' : ''}`}
                  onClick={() => setGenre(item)}
                  aria-pressed={genre === item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {filteredMovies.length ? (
            <div className="movie-grid">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onSelect={setSelectedMovie} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">⌕</span>
              <h3>No films found</h3>
              <p>Try another title or choose a different genre.</p>
            </div>
          )}
        </section>

        <section className="about-strip">
          <span className="about-icon">✳</span>
          <div>
            <h2>Film is for everyone.</h2>
            <p>Browse the collection and watch at no cost—no account required.</p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand" href="#top" aria-label="Libarray home">
          <span className="brand-mark">▶</span>
          <span>
            LIB<span className="brand-light">ARRAY</span>
          </span>
        </a>
        <p>A free public film catalog.</p>
      </footer>

      <MovieDialog movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  );
}
