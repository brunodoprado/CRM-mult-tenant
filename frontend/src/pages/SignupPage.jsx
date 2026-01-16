// src/pages/SignupPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    subdomain: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
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
      
      // Redirecionar para o domínio do tenant
      window.location.href = response.data.redirect_url;
    } catch (err) {
      setError(err.response?.data?.subdomain?.[0] || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Criar Nova Conta</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome da Empresa
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Subdomínio
            </label>
            <div className="flex items-center">
              <input
                type="text"
                required
                pattern="[a-z0-9]+"
                className="w-full px-3 py-2 border rounded-l-lg"
                value={formData.subdomain}
                onChange={(e) => setFormData({...formData, subdomain: e.target.value.toLowerCase()})}
              />
              <span className="bg-gray-100 px-3 py-2 border border-l-0 rounded-r-lg text-sm">
                .localhost
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Apenas letras e números, sem espaços
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Seu Nome
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.adminName}
              onChange={(e) => setFormData({...formData, adminName: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.adminEmail}
              onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Senha
            </label>
            <input
              type="password"
              required
              minLength={8}
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.adminPassword}
              onChange={(e) => setFormData({...formData, adminPassword: e.target.value})}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Criar Conta'}
          </button>
        </form>
      </div>
    </div>
  );
}