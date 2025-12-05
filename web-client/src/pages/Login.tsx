import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth.service';
import { User, Lock } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      // Se der certo, vai para a Home
      navigate('/'); 
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Entrar no Cinema</h2>
        
        {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>E-mail</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}>
              <User size={18} color="#666" style={{ marginRight: '8px' }} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ border: 'none', outline: 'none', width: '100%' }}
                placeholder="admin@cinema.com"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Senha</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}>
              <Lock size={18} color="#666" style={{ marginRight: '8px' }} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ border: 'none', outline: 'none', width: '100%' }}
                placeholder="******"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', 
              fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px' 
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}