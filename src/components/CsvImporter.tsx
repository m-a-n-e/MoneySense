import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Upload, Check, AlertCircle, FileText, X } from 'lucide-react';

interface CsvRow {
  Data: string;
  Valor: string;
  Identificador: string;
  Descrição: string;
}

interface TransactionPreview {
  date: string;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
}

const CATEGORY_MAP: Record<string, string> = {
  'uber': 'Transporte',
  '99app': 'Transporte',
  'ifood': 'Alimentação',
  'rappi': 'Alimentação',
  'restaurante': 'Alimentação',
  'mercado': 'Mercado',
  'supermercado': 'Mercado',
  'pao de acucar': 'Mercado',
  'farmacia': 'Saúde',
  'drogaria': 'Saúde',
  'netflix': 'Entretenimento',
  'spotify': 'Entretenimento',
  'amazon': 'Compras',
  'magalu': 'Compras',
  'shopee': 'Compras',
  'postu': 'Transporte',
  'gasolina': 'Transporte',
};

export default function CsvImporter({ onComplete }: { onComplete: () => void }) {
  const { user } = useAuth();
  const [previews, setPreviews] = useState<TransactionPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const suggestCategory = (description: string): string => {
    const desc = description.toLowerCase();
    for (const [key, category] of Object.entries(CATEGORY_MAP)) {
      if (desc.includes(key)) return category;
    }
    return 'Outros';
  };

  const sanitizeDescription = (desc: string): string => {
    return desc
      .replace(/\d{2}\/\d{2}\/\d{4}.*/, '')
      .replace(/ - .*/, '')
      .trim();
  };

  const processCsv = (file: File) => {
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const processed = results.data
          .filter(row => row.Data && row.Valor)
          .map(row => {
            // Remove espaços e garante que temos uma string
            const valStr = (row.Valor || '0').trim();
            
            // Lógica robusta para formato brasileiro (1.234,56) ou internacional (1234.56)
            // Se houver vírgula, tratamos como decimal e removemos todos os pontos (milhar)
            let cleanValue: string;
            if (valStr.includes(',')) {
              cleanValue = valStr.replace(/\./g, '').replace(',', '.');
            } else {
              cleanValue = valStr;
            }
            
            const rawValue = parseFloat(cleanValue);
            const sanitizedDesc = sanitizeDescription(row.Descrição || row.Identificador || '');
            
            return {
              date: row.Data.split('/').reverse().join('-'),
              amount: Math.abs(rawValue),
              description: sanitizedDesc,
              category: suggestCategory(sanitizedDesc),
              type: rawValue > 0 ? 'income' : ('expense' as const),
            };
          });
        setPreviews(processed);
      },
      error: (error) => console.error('Erro no CSV:', error)
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') processCsv(file);
  }, []);

  const handleUpload = async () => {
    if (!user || previews.length === 0) return;
    setLoading(true);

    try {
      const transactionsToInsert = previews.map(p => ({
        user_id: user.id,
        ...p
      }));

      const { error } = await supabase.from('transactions').insert(transactionsToInsert);
      if (error) throw error;

      setPreviews([]);
      onComplete();
    } catch (error: any) {
      alert('Erro ao importar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl">
      {previews.length === 0 ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all duration-200 min-h-[300px] ${
            isDragging 
              ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]' 
              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
          }`}
        >
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
            isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-slate-400 shadow-sm'
          }`}>
            <Upload size={40} />
          </div>
          <div className="text-center">
            <p className="text-slate-900 font-bold text-lg mb-1">Arraste seu arquivo CSV aqui</p>
            <p className="text-slate-500 text-sm font-medium">Suporta exportações do Nubank e outros bancos</p>
          </div>
          <input 
            type="file" 
            accept=".csv" 
            onChange={(e) => e.target.files?.[0] && processCsv(e.target.files[0])} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Descrição</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {previews.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-medium">{item.date}</td>
                    <td className="px-6 py-4 text-slate-900 font-semibold">{item.description}</td>
                    <td className="px-6 py-4">
                      <input 
                        type="text" 
                        value={item.category} 
                        onChange={(e) => {
                          const next = [...previews];
                          next[idx].category = e.target.value;
                          setPreviews(next);
                        }} 
                        className="bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none px-3 py-1.5 rounded-lg w-full transition-all" 
                      />
                    </td>
                    <td className={`px-6 py-4 text-right font-bold tabular-nums text-base ${item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.type === 'income' ? '+' : '-'} R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 p-6 rounded-2xl gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <FileText className="text-indigo-600" size={20} />
              </div>
              <span className="text-sm font-bold text-slate-700">{previews.length} transações detectadas</span>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button 
                onClick={() => setPreviews([])} 
                className="flex-1 sm:flex-none text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleUpload} 
                disabled={loading} 
                className="flex-1 sm:flex-none bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <><Check size={18} /> Confirmar Importação</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
