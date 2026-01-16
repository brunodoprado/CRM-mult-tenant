// src/pages/CompanySignupPage.jsx
import { useState } from 'react';
import axios from 'axios';
import '../styles/pages.css';

export default function CompanySignupPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    subdomain: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8000/api/signup/', {
        company_name: formData.companyName,
        subdomain: formData.subdomain,
        admin_name: formData.adminName,
        admin_email: formData.adminEmail,
        admin_password: formData.adminPassword,
      });
      
      // Extrair o subdomínio da resposta
      const subdomain = response.data.subdomain?.split('.')[0] || formData.subdomain;
      
      if (!subdomain) {
        setError('Erro ao obter subdomínio');
        return;
      }
      
      // Tentar fazer login automaticamente com as credenciais do admin
      try {
        const loginResponse = await axios.post(`http://${subdomain}.localhost:8000/api/token/`, {
          username: formData.adminEmail,
          password: formData.adminPassword,
        });
        
        // Salvar token no localStorage
        if (loginResponse.data.access) {
          localStorage.setItem('access_token', loginResponse.data.access);
          localStorage.setItem('refresh_token', loginResponse.data.refresh);
          
          // Redirecionar para o dashboard
          window.location.href = `http://${subdomain}.localhost:5173/dashboard`;
        } else {
          // Se não conseguir fazer login automático, redirecionar para login
          window.location.href = `http://${subdomain}.localhost:5173/login`;
        }
      } catch (loginErr) {
        // Se houver erro no login automático, redirecionar para login mesmo assim
        // O usuário pode fazer login manualmente
        console.warn('Login automático falhou, redirecionando para página de login:', loginErr);
        window.location.href = `http://${subdomain}.localhost:5173/login`;
      }
    } catch (err) {
      setError(err.response?.data?.subdomain?.[0] || err.response?.data?.message || 'Erro ao criar empresa');
      setLoading(false);
    }
  };
  
  return (
    <div className="page-container">
      <div className="page-card">
        <h1 className="page-title">Criar Nova Empresa</h1>
        
        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="page-form">
          <div className="form-group">
            <label className="form-label">
              Nome da Empresa
            </label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Subdomínio
            </label>
            <div className="form-input-group">
              <input
                type="text"
                required
                pattern="[a-z0-9]+"
                className="form-input"
                value={formData.subdomain}
                onChange={(e) => setFormData({...formData, subdomain: e.target.value.toLowerCase()})}
              />
              <span className="form-input-suffix">
                .localhost
              </span>
            </div>
            <p className="form-help-text">
              Apenas letras e números, sem espaços
            </p>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Nome do Administrador
            </label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.adminName}
              onChange={(e) => setFormData({...formData, adminName: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Email do Administrador
            </label>
            <input
              type="email"
              required
              className="form-input"
              value={formData.adminEmail}
              onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Senha do Administrador
            </label>
            <input
              type="password"
              required
              minLength={8}
              className="form-input"
              value={formData.adminPassword}
              onChange={(e) => setFormData({...formData, adminPassword: e.target.value})}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Criando...' : 'Criar Empresa'}
          </button>
        </form>
      </div>
    </div>
  );
}
