import { Link } from 'react-router-dom';
import { Wallet, Lock, AlertCircle } from 'lucide-react';

export default function Register() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-40 -z-10" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-40 -z-10" />

      <div className="w-full max-w-lg relative">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-8 transition-transform hover:scale-105 active:scale-95">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Wallet className="text-white" size={30} />
            </div>
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              MoneySense
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Cadastros Suspensos</h2>
          <p className="text-slate-500 font-medium mt-3">
            O sistema está operando em modo restrito.
          </p>
        </div>

        {/* Info Container */}
        <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100 relative text-center">
          <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Lock className="text-amber-600" size={40} />
          </div>
          
          <div className="space-y-4 mb-10">
            <h3 className="text-xl font-bold text-slate-900">Acesso Restrito</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Novas contas só podem ser criadas pela equipe de administração do projeto MoneySense. Se você já possui uma conta, por favor realize o login.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex items-center gap-4 text-left mb-10">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <AlertCircle className="text-indigo-600" size={20} />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-tight">
              Apenas usuários autorizados pelo administrador do sistema podem acessar a plataforma.
            </p>
          </div>

          <Link
            to="/login"
            className="block w-full bg-indigo-600 text-white py-4.5 rounded-2xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100 text-lg active:scale-[0.98]"
          >
            Ir para Login
          </Link>
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
