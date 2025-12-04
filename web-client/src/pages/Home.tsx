import { useEffect, useState } from 'react';
import { getMovies } from '../services/api';
import { Movie } from '../types';
import { Film } from 'lucide-react'; // Ícone
import { useNavigate } from 'react-router-dom';

export function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Busca os filmes ao carregar a página
    getMovies().then((data) => {
      setMovies(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Carregando catálogo...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ marginBottom: '30px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Film /> Cinema Microservices
        </h1>
      </header>

      <main>
        <h2>Em Cartaz</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {movies.map((movie) => (
            <div key={movie.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              {movie.posterUrl && (
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title} 
                  style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '4px' }} 
                />
              )}
              <h3>{movie.title}</h3>
              <p style={{ color: '#666', fontSize: '0.9em' }}>{movie.genre} • {movie.durationMin} min</p>
              <button 
                onClick={() => navigate(`/movie/${movie.id}`)} // <--- Atualize isto
                style={{ /* estilos mantidos */ }}>
                Ver Sessões
            </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}