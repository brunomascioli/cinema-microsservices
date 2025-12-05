import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, QrCode, ArrowLeft, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [method, setMethod] = useState<'PIX' | 'CREDIT'>('PIX');

  // Recebe os dados acumulados
  const { total, session } = location.state as any || {};

  if (!total) return <div>Carrinho vazio.</div>;

  const handleFinish = () => {
    alert("Integração com Gateway de Pagamento será implementada em breve!");
    // Futuramente aqui chamaremos a API de Pagamentos
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <button 
        onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}
      >
        <ArrowLeft size={20} /> Voltar
      </button>

      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Resumo do Pedido</h2>
      
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <p><strong>Sessão:</strong> {session?.room?.name}</p>
        <p><strong>Data:</strong> {new Date(session?.startTime).toLocaleString()}</p>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', marginTop: '10px' }}>
          R$ {Number(total).toFixed(2)}
        </div>
      </div>

      <h3 style={{ marginBottom: '20px' }}>Forma de Pagamento</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}>
        {/* Opção PIX */}
        <div 
          onClick={() => setMethod('PIX')}
          style={{ 
            padding: '20px', border: method === 'PIX' ? '2px solid #007bff' : '1px solid #ddd', 
            borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px',
            backgroundColor: method === 'PIX' ? '#f0f7ff' : 'white'
          }}
        >
          <QrCode size={30} color={method === 'PIX' ? '#007bff' : '#666'} />
          <div>
            <div style={{ fontWeight: 'bold' }}>Pix (Instantâneo)</div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Aprovação imediata</div>
          </div>
        </div>

        {/* Opção Cartão */}
        <div 
          onClick={() => setMethod('CREDIT')}
          style={{ 
            padding: '20px', border: method === 'CREDIT' ? '2px solid #007bff' : '1px solid #ddd', 
            borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px',
            backgroundColor: method === 'CREDIT' ? '#f0f7ff' : 'white'
          }}
        >
          <CreditCard size={30} color={method === 'CREDIT' ? '#007bff' : '#666'} />
          <div>
            <div style={{ fontWeight: 'bold' }}>Cartão de Crédito / Débito</div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Visa, Master, Elo</div>
          </div>
        </div>
      </div>

      <button 
        onClick={handleFinish}
        style={{ 
          width: '100%', padding: '15px', backgroundColor: '#28a745', color: 'white', 
          border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', 
          cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
        }}
      >
        <CheckCircle /> Finalizar Compra
      </button>
    </div>
  );
}