import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import CsvImporter from '../components/CsvImporter';
import ProfileMenu from '../components/ProfileMenu';
import DateFilter from '../components/DateFilter';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  PieChart as PieChartIcon,
  X,
  Pencil,
  Trash2,
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

  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>();
    
    // Adiciona todos os anos das transações
    transactions.forEach(t => {
      const year = new Date(t.date).getFullYear();
      yearsSet.add(year);
    });
    
    // Sempre inclui o ano atual
    yearsSet.add(new Date().getFullYear());
    
    // Converte para array e ordena em ordem decrescente
    return Array.from(yearsSet).sort((a, b) => b - a);
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
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Wallet className="text-white" size={30} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">MoneySense</h1>
                <p className="text-slate-500 text-sm font-medium">Controle financeiro inteligente</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <DateFilter
              months={MONTHS}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              availableYears={availableYears}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
            />
            <button 
              onClick={() => setIsImportOpen(true)} 
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 h-11 rounded-xl hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all duration-200 font-bold text-sm"
            >
              <FileDown size={18} className="text-slate-500" /> <span className="hidden sm:inline">Importar</span>
            </button>
            <button 
              onClick={() => handleOpenModal()} 
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 h-11 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all duration-200 font-bold text-sm"
            >
              <Plus size={18} /> <span>Nova Transação</span>
            </button>
            <ProfileMenu onSignOut={signOut} />
          </div>
        </header>

        {isImportOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <FileDown className="text-indigo-600" size={22} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Importar Transações</h2>
                </div>
                <button onClick={() => setIsImportOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full transition-colors"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <CsvImporter onComplete={() => { setIsImportOpen(false); fetchTransactions(); }} />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card 
            title="Saldo Total" 
            value={totals.balance} 
            icon={<Wallet className="text-indigo-600" size={22} />} 
          />
          <Card 
            title="Receitas" 
            value={totals.income} 
            icon={<TrendingUp className="text-emerald-600" size={22} />} 
            color="text-emerald-600" 
          />
          <Card 
            title="Despesas" 
            value={totals.expense} 
            icon={<TrendingDown className="text-rose-600" size={22} />} 
            color="text-rose-600" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                <PieChartIcon size={18} className="text-indigo-600" />
              </div>
              Gastos por Categoria
            </h2>
            <div className="h-[320px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={chartData} 
                      innerRadius={70} 
                      outerRadius={100} 
                      paddingAngle={8} 
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((_, i) => (
                        <Cell 
                          key={i} 
                          fill={COLORS[i % COLORS.length]} 
                          stroke="none"
                          {...({ cornerRadius: 4 } as any)} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']} 
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                  <PieChartIcon size={48} className="opacity-20" />
                  <p className="font-medium">Sem dados para este período</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleSelectAll} 
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-all"
                >
                  {selectedIds.length === transactions.length && transactions.length > 0 
                    ? <CheckSquare size={22} className="text-indigo-600" /> 
                    : <Square size={22} />
                  }
                </button>
                <h2 className="text-lg font-bold text-slate-900">Transações</h2>
              </div>
              {selectedIds.length > 0 && (
                <button 
                  onClick={handleDeleteMany} 
                  className="flex items-center gap-2 text-rose-600 text-sm font-bold bg-rose-50 px-4 py-2 rounded-xl hover:bg-rose-100 transition-all duration-200"
                >
                  <Trash2 size={16} /> Excluir ({selectedIds.length})
                </button>
              )}
            </div>
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="font-medium">Carregando...</p>
                </div>
              ) : transactions.length > 0 ? (
                transactions.map((t) => (
                  <div 
                    key={t.id} 
                    className={`group flex justify-between items-center p-4 rounded-2xl transition-all duration-200 border ${
                      selectedIds.includes(t.id) 
                        ? 'bg-indigo-50/50 border-indigo-100' 
                        : 'bg-white hover:bg-slate-50 border-transparent hover:border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <button 
                        onClick={() => toggleSelect(t.id)} 
                        className={`transition-colors ${selectedIds.includes(t.id) ? 'text-indigo-600' : 'text-slate-300 hover:text-indigo-400'}`}
                      >
                        {selectedIds.includes(t.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                      </button>
                      <div>
                        <p className="font-semibold text-slate-900">{t.description}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-md tracking-wider">
                            {t.category}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {new Date(t.date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-bold tabular-nums text-lg ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {t.type === 'income' ? '+' : '-'} R$ {Number(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button 
                          onClick={() => handleOpenModal(t)} 
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                        >
                          <Pencil size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                    <PieChartIcon size={32} className="opacity-20" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-slate-500">Nenhuma transação encontrada</p>
                    <p className="text-sm">Que tal adicionar sua primeira despesa?</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Plus className="text-indigo-600" size={22} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{editingTransaction ? 'Editar Transação' : 'Nova Transação'}</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full transition-colors"><X size={24} /></button>
              </div>
              <form onSubmit={handleSaveTransaction} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Descrição</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ex: Aluguel, Supermercado..."
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Valor (R$)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      required 
                      placeholder="0,00"
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)} 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all tabular-nums" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Tipo</label>
                    <select 
                      value={type} 
                      onChange={(e) => setType(e.target.value as 'income' | 'expense')} 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    >
                      <option value="expense">Despesa</option>
                      <option value="income">Receita</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Categoria</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ex: Casa, Lazer"
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)} 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Data</label>
                    <input 
                      type="date" 
                      required 
                      value={date} 
                      onChange={(e) => setDate(e.target.value)} 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all duration-200 mt-4 active:scale-[0.98]"
                >
                  {editingTransaction ? 'Salvar Alterações' : 'Confirmar Transação'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, value, icon, color = 'text-slate-900' }: { title: string, value: number, icon: React.ReactNode, color?: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className={`text-3xl font-bold tabular-nums tracking-tight ${color}`}>
        R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}
