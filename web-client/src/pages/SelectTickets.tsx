import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SessionDetails, Seat } from '../types';
import { ArrowLeft, Ticket, DollarSign } from 'lucide-react';

// Preço Base Simulado (já que não vem do back ainda)
const PRICE_FULL = 40;
const PRICE_HALF = 20;

export function SelectTickets() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Recebe os dados da tela anterior
  const { selectedSeats, session } = location.state as { selectedSeats: string[], session: SessionDetails } || {};

  // Estado para armazenar o tipo de ingresso de cada assento (default: INTEIRA)
  // Formato: { 'seat_id_1': 'FULL', 'seat_id_2': 'HALF' }
  const [ticketTypes, setTicketTypes] = useState<Record<string, 'FULL' | 'HALF'>>(
    selectedSeats ? selectedSeats.reduce((acc, id) => ({ ...acc, [id]: 'FULL' }), {}) : {}
  );

  // Se o usuário tentar acessar direto pela URL sem selecionar assentos, volta
  if (!selectedSeats || !session) {
    return <div style={{ padding: 20 }}>Nenhum assento selecionado. <button onClick={() => navigate(-1)}>Voltar</button></div>;
  }

  // Encontra os objetos Seat completos baseados nos IDs selecionados
  const seatsData = session.room.seats.filter(s => selectedSeats.includes(s.id));

  // Calcula o total
  const total = Object.values(ticketTypes).reduce((acc, type) => {
    return acc + (type === 'FULL' ? PRICE_FULL : PRICE_HALF);
  }, 0);

  const handleTypeChange = (seatId: string, type: 'FULL' | 'HALF') => {
    setTicketTypes(prev => ({ ...prev, [seatId]: type }));
  };

  const goToPayment = () => {
    navigate('/payment', {
      state: {
        session,
        ticketTypes, // Quais assentos são meia/inteira
        total,
        seatsData
      }
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <button 
        onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}
      >
        <ArrowLeft size={20} /> Voltar para Assentos
      </button>

      <h2 style={{ marginBottom: '10px' }}>Defina seus Ingressos</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>{session.room.name} • Filme ID: {session.movieId}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {seatsData.map(seat => (
          <div key={seat.id} style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                width: '40px', height: '40px', background: '#007bff', color: 'white', 
                borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' 
              }}>
                {seat.row}{seat.number}
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>Assento {seat.row}-{seat.number}</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>Padrão</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleTypeChange(seat.id, 'HALF')}
                style={{
                  padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer',
                  backgroundColor: ticketTypes[seat.id] === 'HALF' ? '#e7f1ff' : 'white',
                  borderColor: ticketTypes[seat.id] === 'HALF' ? '#007bff' : '#ccc',
                  color: ticketTypes[seat.id] === 'HALF' ? '#007bff' : 'black',
                }}
              >
                Meia <br/><small>R$ {PRICE_HALF.toFixed(2)}</small>
              </button>
              <button
                onClick={() => handleTypeChange(seat.id, 'FULL')}
                style={{
                  padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer',
                  backgroundColor: ticketTypes[seat.id] === 'FULL' ? '#e7f1ff' : 'white',
                  borderColor: ticketTypes[seat.id] === 'FULL' ? '#007bff' : '#ccc',
                  color: ticketTypes[seat.id] === 'FULL' ? '#007bff' : 'black',
                }}
              >
                Inteira <br/><small>R$ {PRICE_FULL.toFixed(2)}</small>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- TOTAL E AÇÃO --- */}
      <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Total:</span>
          <strong style={{ color: '#28a745' }}>R$ {total.toFixed(2)}</strong>
        </div>
        
        <button 
          onClick={goToPayment}
          style={{ 
            padding: '15px 40px', backgroundColor: '#28a745', color: 'white', 
            border: 'none', borderRadius: '6px', fontSize: '18px', fontWeight: 'bold', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'
          }}
        >
          Continuar para Pagamento <DollarSign size={20} />
        </button>
      </div>
    </div>
  );
}