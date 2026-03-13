import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Logo from '../components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-40 -z-10" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-40 -z-10" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-8 transition-transform hover:scale-105 active:scale-95">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Logo className="text-white" size={30} />
            </div>
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              MoneySense
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Bem-vindo de volta</h2>
          <p className="text-slate-500 font-medium mt-3">
            Acesse sua conta para gerenciar suas finanças
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100 relative">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 px-5 py-4 rounded-2xl text-sm font-bold flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="w-5 h-5 bg-rose-200 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">!</div>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Email Corporativo
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-sm font-bold text-slate-700">
                  Senha Segura
                </label>
                <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Esqueceu?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4.5 rounded-2xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-2 mt-8 text-lg active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Entrar no Dashboard <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 font-medium">
              O cadastro de novos usuários é restrito ao administrador.
            </p>
          </div>
        </div>

        {/* Back to Landing */}
        <div className="text-center mt-10">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all text-sm font-bold group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
