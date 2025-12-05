import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMovies } from '../services/api';
import { Movie } from '../types';
import { Film, Calendar, Clock } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Busca os filmes reais do backend
    getMovies()
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar filmes:", err);
        setError("Não foi possível carregar o catálogo. Tente novamente mais tarde.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px', fontSize: '18px', color: '#666' }}>
        Carregando filmes em cartaz...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px' 
      }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#333' }}>
          <Film color="#007bff" /> Cinema Microsserviços
        </h1>
        
        {/* Botão de Login (se quiser adicionar) */}
        <button 
          onClick={() => navigate('/login')}
          style={{ padding: '8px 16px', border: '1px solid #ddd', background: 'white', borderRadius: '4px', cursor: 'pointer' }}
        >
          Área Administrativa
        </button>
      </header>

      <main>
        <h2 style={{ marginBottom: '20px', color: '#444' }}>Em Cartaz</h2>
        
        {movies.length === 0 ? (
          <p style={{ color: '#777' }}>Nenhum filme encontrado no catálogo.</p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '30px' 
          }}>
            {movies.map((movie) => (
              <div key={movie.id} style={{ 
                border: '1px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)', transition: 'transform 0.2s', backgroundColor: 'white'
              }}>
                {/* Imagem com Fallback (caso o seed não tenha URL) */}
                <div style={{ height: '350px', backgroundColor: '#f0f0f0', overflow: 'hidden' }}>
                  <img 
                    src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=Sem+Poster'} 
                    alt={movie.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => {
                      // Se a imagem quebrar, coloca um placeholder
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=Imagem+Indisponível';
                    }}
                  />
                </div>

                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#222' }}>{movie.title}</h3>
                  
                  <div style={{ display: 'flex', gap: '15px', color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> {movie.durationMin} min
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} /> {new Date(movie.releaseDate).getFullYear()}
                    </span>
                  </div>

                  <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.4', marginBottom: '20px', height: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {movie.description}
                  </p>

                  <button 
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    style={{ 
                      width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', 
                      border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' 
                    }}
                  >
                    Ver Sessões
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}