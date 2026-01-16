// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages.css';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  // Obter o subdomínio atual do hostname
  const getSubdomain = () => {
    const hostname = window.location.hostname;
    if (hostname.includes('.')) {
      return hostname.split('.')[0];
    }
    return null;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const subdomain = getSubdomain();
      if (!subdomain) {
        setError('Subdomínio não encontrado');
        return;
      }
      
      // Fazer login usando o endpoint de token do backend
      // O backend usa username (que é o email) para autenticação
      const response = await axios.post(`http://${subdomain}.localhost:8000/api/token/`, {
        username: formData.email,
        password: formData.password,
      });
      
      // Salvar token no localStorage
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        // Redirecionar para o dashboard usando o hostname atual
        const currentHost = window.location.host; // Inclui porta se houver
        window.location.href = `${window.location.protocol}//${currentHost}/dashboard`;
      } else {
        setError('Token de acesso não recebido');
      }
    } catch (err) {
      // Extrair mensagem de erro de forma mais robusta
      let errorMessage = 'Email ou senha incorretos';
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Verificar se há uma mensagem de detalhe (comum em JWT)
        if (errorData.detail) {
          errorMessage = errorData.detail;
        }
        // Verificar se há uma mensagem geral
        else if (errorData.message) {
          errorMessage = errorData.message;
        }
        // Verificar se há uma mensagem de erro não estruturada
        else if (errorData.error) {
          errorMessage = errorData.error;
        }
        // Verificar se há erros de campo
        else if (typeof errorData === 'object') {
          const firstError = Object.values(errorData).find(val => 
            (Array.isArray(val) && val.length > 0) || typeof val === 'string'
          );
          if (firstError) {
            errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
          }
        }
        // Se for uma string direta
        else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } 
      // Erro de rede ou sem resposta
      else if (err.message) {
        errorMessage = `Erro de conexão: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="page-container">
      <div className="page-card">
        <h1 className="page-title">Login</h1>
        
        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="page-form">
          <div className="form-group">
            <label className="form-label">
              Email
            </label>
            <input
              type="email"
              required
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Senha
            </label>
            <input
              type="password"
              required
              className="form-input"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p className="form-help-text">
            Não tem uma conta?{' '}
            <Link to="/register" className="link-primary">
              Registrar novo usuário
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
