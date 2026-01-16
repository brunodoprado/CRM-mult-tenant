import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CompanySignupPage from './pages/CompanySignupPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  // Verificar se está autenticado
  const isAuthenticated = () => {
    const token = localStorage.getItem('access_token');
    return !!token; // Retorna true se token existir
  };

  // Verificar se estamos no localhost principal ou em um subdomínio
  const isMainDomain = () => {
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1';
  };

  // Se estiver no domínio principal (localhost), mostrar apenas a página de criação de empresa
  if (isMainDomain()) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CompanySignupPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // Se estiver em um subdomínio, mostrar rotas de login/register/dashboard
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública - Login */}
        <Route 
          path="/login" 
          element={
            isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage />
            )
          } 
        />
        
        {/* Rota pública - Registro */}
        <Route 
          path="/register" 
          element={
            isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <RegisterPage />
            )
          } 
        />
        
        {/* Rota protegida - Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated() ? (
              <DashboardPage />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* Rota raiz - redireciona baseado na autenticação */}
        <Route 
          path="/" 
          element={
            isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
