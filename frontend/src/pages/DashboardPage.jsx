// src/pages/DashboardPage.jsx
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function DashboardPage() {
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await axios.get('http://acme.localhost:8000/api/customers/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      return response.data;
    }
  });
  
  if (isLoading) return <div>Carregando...</div>;
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Clientes</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Nome</th>
              <th className="text-left py-2">Email</th>
              <th className="text-left py-2">Telefone</th>
            </tr>
          </thead>
          <tbody>
            {customers?.map(customer => (
              <tr key={customer.id} className="border-b">
                <td className="py-2">{customer.name}</td>
                <td className="py-2">{customer.email}</td>
                <td className="py-2">{customer.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}