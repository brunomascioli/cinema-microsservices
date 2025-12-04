import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById } from '../services/api';
import { Movie, Session } from '../types';
import { ArrowLeft, Clock, MapPin } from 'lucide-react';

// Tipo auxiliar para juntar Filme + Sessões
type MovieDetailData = Movie & { sessions: Session[] };

export function MovieDetail() {
  const { id } = useParams(); // Pega o ID da URL (ex: /movie/1)
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetailData | null>(null);

  useEffect(() => {
    if (id) {
      getMovieById(id).then(setMovie);
    }
  }, [id]);

  if (!movie) return <div style={{ padding: 20 }}>Carregando detalhes...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial' }}>
      <button 
        onClick={() => navigate('/')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px', fontSize: '16px' }}
      >
        <ArrowLeft size={20} /> Voltar
      </button>

      <div style={{ display: 'flex', gap: '30px', flexDirection: 'row' }}>
        {/* Poster */}
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          style={{ width: '200px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
        />

        {/* Informações */}
        <div>
          <h1 style={{ marginTop: 0 }}>{movie.title}</h1>
          <p style={{ color: '#555' }}>{movie.genre} • {movie.durationMin} min</p>
          <p>{movie.description}</p>

          <h3 style={{ marginTop: '30px' }}>Sessões Disponíveis</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {movie.sessions.map(session => (
              <div key={session.id} style={{ 
                border: '1px solid #ddd', padding: '15px', borderRadius: '6px', 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9'
              }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                    <Clock size={16} /> 
                    {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#666' }}>
                    <MapPin size={16} /> 
                    {session.room?.name || 'Sala Desconhecida'}
                  </span>
                </div>
                <button style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Comprar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}