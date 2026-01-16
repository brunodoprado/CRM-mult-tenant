// src/pages/DashboardPage.jsx
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  
  // Obter o subdomínio atual do hostname
  const getSubdomain = () => {
    const hostname = window.location.hostname;
    if (hostname.includes('.')) {
      return hostname.split('.')[0];
    }
    return null;
  };
  
  const subdomain = getSubdomain();
  
  const { data: customers, isLoading, error } = useQuery({
    queryKey: ['customers', subdomain],
    queryFn: async () => {
      if (!subdomain) {
        throw new Error('Subdomínio não encontrado');
      }
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        // Se não houver token, redirecionar para login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        throw new Error('Não autenticado');
      }
      
      try {
        // A URL é /api/api/customers/ porque:
        // - backend/urls.py inclui crm.urls em 'api/'
        // - crm/urls.py inclui router.urls em 'api/'
        // - router registra 'customers'
        const response = await axios.get(`http://${subdomain}.localhost:8000/api/api/customers/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      } catch (err) {
        // Se receber 401, token expirado ou inválido
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          // Aguardar um pouco antes de redirecionar para mostrar a mensagem
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          throw new Error('Sessão expirada ou não autorizado. Redirecionando para login...');
        }
        throw err;
      }
    },
    enabled: !!subdomain
  });
  
  if (isLoading) return <div className="loading-state">Carregando...</div>;
  
  if (!subdomain) {
    return <div className="loading-state">Erro: Subdomínio não encontrado</div>;
  }
  
  if (error) {
    const isAuthError = error.message?.includes('Sessão expirada') || error.message?.includes('Não autenticado');
    
    return (
      <div className="content-container">
        <h1 className="page-title-large">Dashboard</h1>
        <div className="content-card">
          <div className="alert-error">
            {isAuthError ? (
              <div>
                <p>{error.message}</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  Redirecionando para login...
                </p>
              </div>
            ) : (
              <div>
                <p>Erro ao carregar clientes: {error.message || 'Erro desconhecido'}</p>
                {error.response?.status === 401 && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                    Token expirado ou inválido. Por favor, faça login novamente.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Usar window.location.href para garantir o redirecionamento
    window.location.href = '/login';
  };

  return (
    <div className="content-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title-large" style={{ marginBottom: 0 }}>Dashboard</h1>
        <button
          onClick={handleLogout}
          className="btn-primary"
          style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          Sair
        </button>
      </div>
      
      <div className="content-card">
        <h2 className="content-subtitle">Clientes</h2>
        {customers && customers.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum cliente cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}