import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import CsvImporter from '../components/CsvImporter';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  LogOut,
  PieChart as PieChartIcon,
  X,
  Pencil,
  Trash2,
  Calendar,
  FileDown,
  CheckSquare,
  Square
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState(now.toISOString().split('T')[0]);

  useEffect(() => {
    fetchTransactions();
    setSelectedIds([]);
  }, [selectedMonth, selectedYear]);

  const fetchTransactions = async () => {
    setLoading(true);
    const startDate = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-01`;
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const endDate = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) console.error('Erro ao buscar transações:', error);
    else setTransactions(data || []);
    setLoading(false);
  };

  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        const val = Number(curr.amount);
        if (curr.type === 'income') {
          acc.income += val;
          acc.balance += val;
        } else {
          acc.expense += val;
          acc.balance -= val;
        }
        return acc;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  }, [transactions]);

  const chartData = useMemo(() => {
    const categories: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + Number(t.amount);
      });

    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const handleOpenModal = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setDescription(transaction.description);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
      setType(transaction.type);
      setDate(transaction.date);
    } else {
      setEditingTransaction(null);
      setDescription('');
      setAmount('');
      setCategory('');
      setType('expense');
      setDate(new Date().toISOString().split('T')[0]);
    }
    setIsModalOpen(true);
  };

  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const transactionData = {
      user_id: user.id,
      description,
      amount: parseFloat(amount),
      category,
      type,
      date
    };

    const { error } = editingTransaction 
      ? await supabase.from('transactions').update(transactionData).eq('id', editingTransaction.id)
      : await supabase.from('transactions').insert([transactionData]);

    if (!error) {
      setIsModalOpen(false);
      fetchTransactions();
    }
  };

  const handleDeleteMany = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Excluir ${selectedIds.length} transações selecionadas?`)) return;

    const { error } = await supabase.from('transactions').delete().in('id', selectedIds);
    if (!error) {
      setSelectedIds([]);
      fetchTransactions();
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === transactions.length ? [] : transactions.map(t => t.id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MoneySense</h1>
            <p className="text-gray-500 text-sm">Olá, {user?.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm text-sm">
              <Calendar size={16} className="ml-2 text-gray-400" />
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="bg-transparent border-none focus:ring-0">
                {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
              <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="bg-transparent border-none focus:ring-0">
                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <button onClick={() => setIsImportOpen(true)} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 shadow-sm">
              <FileDown size={20} /> <span className="hidden sm:inline">Importar CSV</span>
            </button>
            <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm">
              <Plus size={20} /> <span>Nova Transação</span>
            </button>
            <button onClick={signOut} className="p-2 text-gray-400 hover:text-red-600"><LogOut size={20} /></button>
          </div>
        </header>

        {isImportOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
                <div className="flex items-center gap-2"><FileDown className="text-indigo-600" size={24} /><h2 className="text-xl font-bold">Importar CSV</h2></div>
                <button onClick={() => setIsImportOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto"><CsvImporter onComplete={() => { setIsImportOpen(false); fetchTransactions(); }} /></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card title="Saldo Total" value={totals.balance} icon={<Wallet className="text-indigo-600" />} />
          <Card title="Receitas" value={totals.income} icon={<TrendingUp className="text-emerald-600" />} color="text-emerald-600" />
          <Card title="Despesas" value={totals.expense} icon={<TrendingDown className="text-rose-600" />} color="text-rose-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2"><PieChartIcon size={20} className="text-indigo-600" /> Gastos por Categoria</h2>
            <div className="h-[300px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie><Tooltip formatter={(v: number) => `R$ ${v.toLocaleString('pt-BR')}`} /><Legend /></PieChart>
                </ResponsiveContainer>
              ) : <div className="h-full flex items-center justify-center text-gray-400">Sem dados para este período.</div>}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <button onClick={toggleSelectAll} className="text-gray-400 hover:text-indigo-600 transition">
                  {selectedIds.length === transactions.length && transactions.length > 0 ? <CheckSquare size={20} className="text-indigo-600" /> : <Square size={20} />}
                </button>
                <h2 className="text-lg font-semibold">Transações do Mês</h2>
              </div>
              {selectedIds.length > 0 && (
                <button onClick={handleDeleteMany} className="flex items-center gap-2 text-red-600 text-sm font-bold bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition">
                  <Trash2 size={16} /> Excluir ({selectedIds.length})
                </button>
              )}
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {loading ? <p className="text-center py-4 text-gray-400">Carregando...</p> : transactions.length > 0 ? transactions.map((t) => (
                <div key={t.id} className={`group flex justify-between items-center p-3 rounded-lg transition border ${selectedIds.includes(t.id) ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-gray-50 border-transparent'}`}>
                  <div className="flex items-center gap-3 flex-1">
                    <button onClick={() => toggleSelect(t.id)} className={`transition-colors ${selectedIds.includes(t.id) ? 'text-indigo-600' : 'text-gray-300 hover:text-indigo-400'}`}>
                      {selectedIds.includes(t.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                    </button>
                    <div>
                      <p className="font-medium text-gray-800">{t.description}</p>
                      <span className="text-xs text-gray-500 uppercase">{t.category} • {new Date(t.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>{t.type === 'income' ? '+' : '-'} R$ {Number(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => handleOpenModal(t)} className="p-1 text-gray-400 hover:text-indigo-600"><Pencil size={16} /></button>
                    </div>
                  </div>
                </div>
              )) : <p className="text-center py-4 text-gray-400">Nenhuma transação encontrada.</p>}
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold">{editingTransaction ? 'Editar Transação' : 'Nova Transação'}</h2><button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button></div>
              <form onSubmit={handleSaveTransaction} className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700">Descrição</label><input type="text" required value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700">Valor (R$)</label><input type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-700">Tipo</label><select value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')} className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"><option value="expense">Despesa</option><option value="income">Receita</option></select></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700">Categoria</label><input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" /></div>
                  <div><label className="block text-sm font-medium text-gray-700">Data</label><input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" /></div>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition mt-4">{editingTransaction ? 'Salvar Alterações' : 'Salvar Transação'}</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, value, icon, color = 'text-gray-900' }: { title: string, value: number, icon: React.ReactNode, color?: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-gray-500 uppercase">{title}</span>{icon}</div><p className={`text-2xl font-bold ${color}`}>R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div>
  );
}
