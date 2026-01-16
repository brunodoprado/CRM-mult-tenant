// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
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
    
    // Validar senhas
    if (formData.password !== formData.passwordConfirm) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }
    
    if (formData.password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      setLoading(false);
      return;
    }
    
    try {
      const subdomain = getSubdomain();
      if (!subdomain) {
        setError('Subdomínio não encontrado');
        return;
      }
      
      // Registrar novo usuário
      // O backend espera username, email, password, first_name, last_name
      const nameParts = formData.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const response = await axios.post(`http://${subdomain}.localhost:8000/api/register/`, {
        username: formData.email, // Usar email como username
        email: formData.email,
        password: formData.password,
        first_name: firstName,
        last_name: lastName,
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
      let errorMessage = 'Erro ao registrar usuário';
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Verificar se é um objeto com campos de erro
        if (typeof errorData === 'object') {
          // Tentar pegar erros de campos específicos (email, username, password, etc)
          const fieldErrors = Object.keys(errorData).find(key => 
            Array.isArray(errorData[key]) && errorData[key].length > 0
          );
          
          if (fieldErrors) {
            errorMessage = Array.isArray(errorData[fieldErrors]) 
              ? errorData[fieldErrors][0] 
              : errorData[fieldErrors];
          } 
          // Verificar se há uma mensagem geral
          else if (errorData.message) {
            errorMessage = errorData.message;
          }
          // Verificar se há uma mensagem de erro não estruturada
          else if (errorData.error) {
            errorMessage = errorData.error;
          }
          // Se for um objeto com detalhes
          else if (errorData.detail) {
            errorMessage = errorData.detail;
          }
          // Tentar pegar o primeiro valor de erro encontrado
          else {
            const firstError = Object.values(errorData).find(val => 
              (Array.isArray(val) && val.length > 0) || typeof val === 'string'
            );
            if (firstError) {
              errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
            }
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
        <h1 className="page-title">Registrar Novo Usuário</h1>
        
        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="page-form">
          <div className="form-group">
            <label className="form-label">
              Nome
            </label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
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
              minLength={8}
              className="form-input"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Confirmar Senha
            </label>
            <input
              type="password"
              required
              minLength={8}
              className="form-input"
              value={formData.passwordConfirm}
              onChange={(e) => setFormData({...formData, passwordConfirm: e.target.value})}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
        
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p className="form-help-text">
            Já tem uma conta?{' '}
            <Link to="/login" className="link-primary">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
