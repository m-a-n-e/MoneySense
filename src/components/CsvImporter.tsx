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
    <div className="bg-white p-6 rounded-xl">
      {previews.length === 0 ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-gray-50'}`}
        >
          <Upload size={48} className={`mb-4 ${isDragging ? 'text-indigo-500' : 'text-gray-400'}`} />
          <p className="text-gray-600 text-center">Arraste seu arquivo CSV do Nubank aqui</p>
          <input type="file" accept=".csv" onChange={(e) => e.target.files?.[0] && processCsv(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="overflow-x-auto border border-gray-100 rounded-lg max-h-[400px]">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium sticky top-0">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {previews.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 whitespace-nowrap">{item.date}</td>
                    <td className="px-4 py-3">{item.description}</td>
                    <td className="px-4 py-3">
                      <input type="text" value={item.category} onChange={(e) => {
                        const next = [...previews];
                        next[idx].category = e.target.value;
                        setPreviews(next);
                      }} className="bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none w-full" />
                    </td>
                    <td className={`px-4 py-3 text-right font-bold ${item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.type === 'income' ? '+' : '-'} R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-lg">
            <span className="text-sm font-medium text-indigo-700">{previews.length} transações detectadas</span>
            <div className="flex gap-3">
              <button onClick={() => setPreviews([])} className="text-gray-600 hover:text-gray-800 text-sm font-medium">Cancelar</button>
              <button onClick={handleUpload} disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
                {loading ? 'Processando...' : <><Check size={18} /> Confirmar Importação</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
