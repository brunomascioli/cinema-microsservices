import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById } from '../services/api';
import { Movie, Session } from '../types';
import { ArrowLeft, Clock, MapPin, Calendar, Ticket } from 'lucide-react';

type MovieDetailData = Movie & { sessions: Session[] };

export function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      getMovieById(id)
        .then(setMovie)
        .catch((err) => {
          console.error(err);
          setError("Não foi possível carregar os detalhes do filme.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Carregando detalhes...</div>;
  
  if (error || !movie) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <p style={{ color: 'red', marginBottom: 20 }}>{error || "Filme não encontrado."}</p>
      <button onClick={() => navigate('/')} style={{ padding: '10px 20px', cursor: 'pointer' }}>Voltar para Home</button>
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Botão Voltar */}
      <button 
        onClick={() => navigate('/')}
        style={{ 
          background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', 
          gap: '8px', marginBottom: '20px', fontSize: '16px', color: '#555' 
        }}
      >
        <ArrowLeft size={20} /> Voltar ao Catálogo
      </button>

      <div style={{ display: 'flex', gap: '40px', flexDirection: 'row', flexWrap: 'wrap' }}>
        
        {/* Coluna da Esquerda: Poster */}
        <div style={{ flex: '0 0 300px' }}>
          <img 
            src={movie.posterUrl || ''} 
            alt={movie.title} 
            style={{ 
              width: '100%', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
              backgroundColor: '#eee', minHeight: '450px', objectFit: 'cover'
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=Sem+Imagem';
            }}
          />
        </div>

        {/* Coluna da Direita: Informações e Sessões */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h1 style={{ marginTop: 0, fontSize: '2.5rem', color: '#333' }}>{movie.title}</h1>
          
          <div style={{ display: 'flex', gap: '20px', color: '#666', margin: '15px 0' }}>
             <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Ticket size={18} /> {movie.genre}
             </span>
             <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={18} /> {movie.durationMin} min
             </span>
             <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={18} /> {new Date(movie.releaseDate).getFullYear()}
             </span>
          </div>

          <p style={{ lineHeight: '1.6', color: '#444', fontSize: '1.1rem', marginBottom: '40px' }}>
            {movie.description}
          </p>

          <h2 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '20px' }}>
            Sessões Disponíveis
          </h2>

          {movie.sessions.length === 0 ? (
            <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '8px', color: '#666' }}>
              Nenhuma sessão disponível para este filme no momento.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {movie.sessions.map(session => {
                const sessionDate = new Date(session.startTime);
                return (
                  <div key={session.id} style={{ 
                    border: '1px solid #e0e0e0', padding: '15px 20px', borderRadius: '8px', 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#007bff', marginBottom: '4px' }}>
                        {sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', fontSize: '0.9rem' }}>
                        <MapPin size={14} /> 
                        {/* Como o backend pode não estar enviando o objeto 'room' populado, mostramos o ID ou um texto genérico */}
                        {session.room?.name || `Sala ${session.roomId ? session.roomId.substring(0,4) : 'Principal'}`}
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '5px' }}>
                        {sessionDate.toLocaleDateString()}
                      </div>
                      <button style={{ 
                        padding: '8px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', 
                        borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' 
                      }}>
                        <Ticket size={16} /> Comprar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}