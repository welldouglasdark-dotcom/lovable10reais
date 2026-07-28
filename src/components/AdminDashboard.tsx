import React, { useState, useEffect } from 'react';
import { Shield, DollarSign, ShoppingCart, Users, Key, RefreshCw, CheckCircle, XCircle, Search, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface OrderRecord {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  profiles?: {
    name: string;
    email: string;
  };
}

interface ProfileRecord {
  id: string;
  name: string;
  email: string;
  avatar: string;
  has_purchased: boolean;
  license_key: string;
  role: string;
  created_at: string;
}

export const AdminDashboard: React.FC = () => {
  const { user, setCurrentPage } = useAuth();
  const [activeTab, setActiveTab] = useState<'sales' | 'users'>('sales');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [profiles, setProfiles] = useState<ProfileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [togglingUser, setTogglingUser] = useState<string | null>(null);

  // Fetch real data from Supabase
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Orders with Profile info
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          id,
          user_id,
          amount,
          status,
          payment_method,
          created_at,
          profiles (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersData) {
        setOrders(ordersData as any);
      }

      // 2. Fetch Profiles
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesData) {
        setProfiles(profilesData as ProfileRecord[]);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute Statistics
  const totalRevenue = orders
    .filter(o => o.status === 'paid' || o.status === 'approved')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 10.00), 0);

  const totalSalesCount = orders.filter(o => o.status === 'paid' || o.status === 'approved').length;
  const totalCustomers = profiles.length;
  const activeVipCount = profiles.filter(p => p.has_purchased).length;

  // Toggle user purchase access
  const handleToggleVip = async (profileId: string, currentStatus: boolean) => {
    setTogglingUser(profileId);
    try {
      const newStatus = !currentStatus;
      await supabase
        .from('profiles')
        .update({
          has_purchased: newStatus,
          purchased_at: newStatus ? new Date().toLocaleDateString('pt-BR') : null
        })
        .eq('id', profileId);

      setProfiles(prev =>
        prev.map(p => (p.id === profileId ? { ...p, has_purchased: newStatus } : p))
      );
    } catch (err) {
      console.error('Error toggling VIP status:', err);
    } finally {
      setTogglingUser(null);
    }
  };

  // Filtered profiles/orders by search query
  const filteredProfiles = profiles.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.license_key && p.license_key.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredOrders = orders.filter(o =>
    (o.profiles?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.profiles?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#08090B] text-gray-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-violet-900/60 via-[#121318] to-[#FF3366]/20 border border-[#FF3366]/40 p-6 sm:p-8 glass-card overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF3366]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF3366]/20 border border-[#FF3366]/40 text-[#FF6584] text-xs font-bold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" />
                <span>Painel de Controle Administrador</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Olá, <span className="text-gradient-lovable">{user?.name || 'Wellington'}</span> 👋
              </h1>
              <p className="text-sm text-gray-400 max-w-xl">
                Acompanhe o faturamento, vendas efetuadas, licenças geradas e gestão completa de clientes do Lovable Pro.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={fetchData}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-[#121318] border border-white/10 hover:border-[#FF3366]/40 text-xs sm:text-sm font-bold text-gray-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Atualizar Dados</span>
              </button>

              <button
                onClick={() => setCurrentPage('vip')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF3366] to-violet-600 hover:from-[#FF2A5C] hover:to-violet-500 text-xs sm:text-sm font-bold text-white transition-all shadow-lg shadow-[#FF3366]/25 flex items-center gap-2 cursor-pointer"
              >
                <span>Ver Área VIP</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Stats Cards Grid - 100% Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Faturamento Total */}
          <div className="p-6 rounded-2xl bg-[#121318] border border-emerald-500/30 glass-card shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Faturamento Total</span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              R$ {totalRevenue.toFixed(2).replace('.', ',')}
            </div>
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <span>● Pagamentos confirmados em PIX</span>
            </div>
          </div>

          {/* Card 2: Total de Vendas */}
          <div className="p-6 rounded-2xl bg-[#121318] border border-[#FF3366]/30 glass-card shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vendas Efetuadas</span>
              <div className="p-2.5 rounded-xl bg-[#FF3366]/10 text-[#FF6584] border border-[#FF3366]/20">
                <ShoppingCart className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {totalSalesCount} <span className="text-sm font-normal text-gray-400">vendas</span>
            </div>
            <div className="text-xs text-gray-400 font-medium">
              Vendas no valor de R$ 10,00 cada
            </div>
          </div>

          {/* Card 3: Clientes Cadastrados */}
          <div className="p-6 rounded-2xl bg-[#121318] border border-violet-500/30 glass-card shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Clientes Cadastrados</span>
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {totalCustomers} <span className="text-sm font-normal text-gray-400">contas</span>
            </div>
            <div className="text-xs text-violet-400 font-semibold">
              Usuários cadastrados no Supabase
            </div>
          </div>

          {/* Card 4: Membros VIP Ativos */}
          <div className="p-6 rounded-2xl bg-[#121318] border border-cyan-500/30 glass-card shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Membros VIP Ativos</span>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Key className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {activeVipCount} <span className="text-sm font-normal text-gray-400">licenças</span>
            </div>
            <div className="text-xs text-cyan-400 font-semibold">
              Acesso à extensão liberado
            </div>
          </div>
        </div>

        {/* Tab Selection & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#121318] p-2 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('sales')}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'sales'
                  ? 'bg-gradient-to-r from-[#FF3366] to-violet-600 text-white shadow-lg shadow-[#FF3366]/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Vendas ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-[#FF3366] to-violet-600 text-white shadow-lg shadow-[#FF3366]/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Clientes ({profiles.length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Buscar por nome, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#08090B] border border-white/10 focus:border-[#FF3366] rounded-xl px-4 py-2 pl-9 text-xs text-gray-200 focus:outline-none transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Tab 1: Sales / Orders Table */}
        {activeTab === 'sales' && (
          <div className="rounded-3xl bg-[#121318] border border-white/10 glass-card shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Histórico de Transações & Vendas</h3>
                <p className="text-xs text-gray-400">Vendas registradas diretamente na tabela orders do Supabase</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-gray-300">
                <thead className="bg-[#08090B] text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">ID Transação</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">E-mail</th>
                    <th className="px-6 py-4">Valor</th>
                    <th className="px-6 py-4">Método</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-400">
                        {loading ? 'Carregando vendas...' : 'Nenhuma venda encontrada.'}
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-[#FF6584]">{order.id.slice(0, 13)}...</td>
                        <td className="px-6 py-4 font-bold text-white">{order.profiles?.name || 'Cliente PIX'}</td>
                        <td className="px-6 py-4 text-gray-400">{order.profiles?.email || 'N/A'}</td>
                        <td className="px-6 py-4 font-black text-emerald-400">
                          R$ {Number(order.amount || 10).toFixed(2).replace('.', ',')}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-md bg-violet-500/10 text-violet-400 border border-violet-500/30 text-[10px] font-bold uppercase">
                            {order.payment_method || 'PIX'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                            order.status === 'paid' || order.status === 'approved'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
                          }`}>
                            {order.status === 'paid' || order.status === 'approved' ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-xs">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Recentely'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Users & Profiles Table */}
        {activeTab === 'users' && (
          <div className="rounded-3xl bg-[#121318] border border-white/10 glass-card shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Gestão de Clientes & Licenças</h3>
                <p className="text-xs text-gray-400">Gerencie usuários, libere licenças VIP e veja perfis salvos no Supabase</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-gray-300">
                <thead className="bg-[#08090B] text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">E-mail</th>
                    <th className="px-6 py-4">Função (Role)</th>
                    <th className="px-6 py-4">Chave de Licença</th>
                    <th className="px-6 py-4">Status VIP</th>
                    <th className="px-6 py-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProfiles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-400">
                        {loading ? 'Carregando clientes...' : 'Nenhum cliente cadastrado ainda.'}
                      </td>
                    </tr>
                  ) : (
                    filteredProfiles.map((prof) => (
                      <tr key={prof.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prof.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${prof.name}`}
                              alt={prof.name}
                              className="w-8 h-8 rounded-full border border-white/10 bg-[#08090B]"
                            />
                            <span className="font-extrabold text-white">{prof.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400">{prof.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            prof.role === 'admin'
                              ? 'bg-[#FF3366]/20 border border-[#FF3366]/40 text-[#FF6584]'
                              : 'bg-gray-800 text-gray-400'
                          }`}>
                            {prof.role || 'client'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-300">
                          {prof.license_key || 'LVB-PRO-PENDING'}
                        </td>
                        <td className="px-6 py-4">
                          {prof.has_purchased ? (
                            <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold uppercase inline-flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              VIP Ativo
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md bg-gray-800 text-gray-400 text-[10px] font-bold uppercase">
                              Gratuito / Não Pagante
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleToggleVip(prof.id, prof.has_purchased)}
                            disabled={togglingUser === prof.id}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              prof.has_purchased
                                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {togglingUser === prof.id
                              ? 'Salvando...'
                              : prof.has_purchased
                              ? 'Revogar VIP'
                              : 'Liberar VIP'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
