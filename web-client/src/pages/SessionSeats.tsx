import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSessionById } from '../services/api';
import { SessionDetails, Seat } from '../types';
import { ArrowLeft, Monitor } from 'lucide-react';

export function SessionSeats() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionDetails | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]); // IDs dos assentos selecionados
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      getSessionById(sessionId)
        .then(setSession)
        .finally(() => setLoading(false));
    }
  }, [sessionId]);

  const toggleSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(id => id !== seatId));
    } else {
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  // --- NOVA FUNÇÃO DE NAVEGAÇÃO ---
  const goToTickets = () => {
    // Navega para a próxima tela enviando o estado (IDs selecionados e dados da sessão)
    navigate(`/session/${sessionId}/tickets`, {
      state: { 
        selectedSeats, 
        session 
      }
    });
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Carregando sala...</div>;
  if (!session) return <div>Sessão não encontrada.</div>;

  // --- Lógica de Organização Visual ---
  // 1. Agrupa os assentos por Fileira (Row)
  const rows: Record<string, Seat[]> = {};
  session.room.seats.forEach(seat => {
    if (!rows[seat.row]) rows[seat.row] = [];
    rows[seat.row].push(seat);
  });

  // 2. Ordena as fileiras (A, B, C...) e os números (1, 2, 3...)
  const sortedRowKeys = Object.keys(rows).sort();
  sortedRowKeys.forEach(key => {
    rows[key].sort((a, b) => a.number - b.number);
  });

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <button 
        onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}
      >
        <ArrowLeft size={20} /> Voltar
      </button>

      <h2 style={{ textAlign: 'center' }}>Selecione seus Lugares</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
        {session.room.name} • {new Date(session.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
      </p>

      {/* --- A TELA DO CINEMA --- */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
        <Monitor size={40} color="#888" />
        <div style={{ 
          width: '80%', height: '8px', backgroundColor: '#bbb', borderRadius: '4px', 
          marginTop: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' 
        }} />
        <span style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>TELA</span>
      </div>

      {/* --- O MAPA DE ASSENTOS --- */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
        {sortedRowKeys.map(rowKey => (
          <div key={rowKey} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ width: '20px', fontWeight: 'bold', color: '#555' }}>{rowKey}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {rows[rowKey].map(seat => {
                const isSelected = selectedSeats.includes(seat.id);
                // Futuramente podemos checar se está ocupado vindo do backend
                const isOccupied = false; 

                return (
                  <button
                    key={seat.id}
                    disabled={isOccupied}
                    onClick={() => toggleSeat(seat.id)}
                    title={`Fileira ${seat.row} - Assento ${seat.number}`}
                    style={{
                      width: '35px', height: '35px', borderRadius: '8px 8px 4px 4px',
                      border: 'none', cursor: isOccupied ? 'not-allowed' : 'pointer',
                      backgroundColor: isOccupied ? '#ddd' : (isSelected ? '#007bff' : 'white'),
                      color: isSelected ? 'white' : '#333',
                      borderBottom: isSelected ? '3px solid #0056b3' : '3px solid #ccc',
                      fontWeight: 'bold', fontSize: '12px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {seat.number}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* --- LEGENDA --- */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px', fontSize: '14px', color: '#555' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '15px', height: '15px', background: 'white', border: '1px solid #ccc' }}></div> Livre
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '15px', height: '15px', background: '#007bff' }}></div> Selecionado
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '15px', height: '15px', background: '#ddd' }}></div> Ocupado
        </div>
      </div>

      {/* --- RODAPÉ DE AÇÃO --- */}
      {selectedSeats.length > 0 && (
        <div style={{ 
          marginTop: '40px', padding: '20px', background: '#f8f9fa', borderRadius: '8px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)', position: 'sticky', bottom: 20
        }}>
          <div>
            <strong>{selectedSeats.length}</strong> ingresso(s) selecionado(s)
          </div>
          <button 
            onClick={goToTickets} 
            style={{ 
              padding: '12px 24px', backgroundColor: '#007bff', color: 'white', 
              border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' 
            }}
          >
            Continuar para ingressos
          </button>
        </div>
      )}
    </div>
  );
}