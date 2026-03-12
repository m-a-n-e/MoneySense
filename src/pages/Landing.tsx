import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PieChart,
  Lock,
  Zap,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: <Wallet className="w-8 h-8" />,
      title: 'Gestão Completa',
      description: 'Organize todas as suas transações em um só lugar com facilidade.',
    },
    {
      icon: <PieChart className="w-8 h-8" />,
      title: 'Análises Visuais',
      description: 'Visualize seus gastos por categoria com gráficos intuitivos e modernos.',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Controle de Receitas',
      description: 'Registre todas as suas receitas e visualize seu fluxo de caixa em tempo real.',
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Segurança de Dados',
      description: 'Seus dados são protegidos com as tecnologias mais avançadas do mercado.',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Importação CSV',
      description: 'Importe transações direto do seu banco em segundos sem esforço manual.',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Relatórios Detalhados',
      description: 'Entenda melhor seus hábitos de consumo com relatórios de alta fidelidade.',
    },
  ];

  const testimonials = [
    {
      name: 'João Silva',
      role: 'Freelancer',
      content: 'MoneySense transformou a forma como organizo minhas finanças. O design é impecável!',
      avatar: 'JS',
    },
    {
      name: 'Maria Santos',
      role: 'Empreendedora',
      content: 'A importação de CSV é mágica. Ganhei horas de produtividade na minha semana.',
      avatar: 'MS',
    },
    {
      name: 'Pedro Costa',
      role: 'Desenvolvedor',
      content: 'Interface limpa, moderna e extremamente rápida. A melhor ferramenta que já usei.',
      avatar: 'PC',
    },
  ];

  return (
    <div className="bg-white selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Wallet className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                MoneySense
              </span>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-10">
              <a href="#features" className="text-slate-600 hover:text-indigo-600 transition-colors font-semibold text-sm">
                Recursos
              </a>
              <a href="#testimonials" className="text-slate-600 hover:text-indigo-600 transition-colors font-semibold text-sm">
                Depoimentos
              </a>
              <div className="w-px h-6 bg-slate-100 mx-2" />
              <button
                onClick={() => navigate('/login')}
                className="text-slate-600 hover:text-indigo-600 transition-colors font-bold text-sm"
              >
                Entrar
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-indigo-600 text-white px-7 py-3 rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all font-bold text-sm active:scale-[0.98]"
              >
                Criar Conta Grátis
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-indigo-600 bg-slate-50 rounded-xl"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="md:hidden pb-6 space-y-4 border-t border-slate-50 pt-6 animate-in slide-in-from-top-4 duration-200">
              <a href="#features" className="block text-slate-600 hover:text-indigo-600 font-bold px-4 py-2 hover:bg-slate-50 rounded-xl transition-all">
                Recursos
              </a>
              <a href="#testimonials" className="block text-slate-600 hover:text-indigo-600 font-bold px-4 py-2 hover:bg-slate-50 rounded-xl transition-all">
                Depoimentos
              </a>
              <div className="flex flex-col gap-3 px-4 pt-2">
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-center text-slate-600 font-bold py-3 bg-slate-50 rounded-2xl transition-all"
                >
                  Entrar
                </button>
                <button
                  onClick={() => {
                    navigate('/register');
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all"
                >
                  Criar Conta Grátis
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-50 -z-10" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-50 -z-10" />

          <div className="text-center mb-16 relative">
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-1.5 rounded-full shadow-sm mb-8 animate-bounce transition-all hover:border-indigo-200">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Novo: Importação Inteligente de CSV</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-8 tracking-tight leading-[1.1]">
              Gerencie suas finanças com
              <span className="block text-indigo-600 mt-2">
                estilo e inteligência
              </span>
            </h1>
            <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              MoneySense é a forma mais moderna e intuitiva de organizar suas transações, visualizar seus gastos e alcançar sua liberdade financeira.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="bg-indigo-600 text-white px-10 py-4.5 rounded-2xl hover:bg-indigo-700 transition-all font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 active:scale-[0.98] text-lg"
              >
                Começar Grátis <ArrowRight size={22} />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-white border border-slate-200 text-slate-700 px-10 py-4.5 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all font-bold text-lg"
              >
                Acessar minha conta
              </button>
            </div>
          </div>

          {/* Hero Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-indigo-600/5 rounded-[40px] -rotate-1 scale-[1.02] -z-10" />
            <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 p-8 md:p-12 relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                    <TrendingUp className="text-emerald-600" size={28} />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Receitas do Mês</p>
                  <p className="text-3xl font-bold text-slate-900 tabular-nums">R$ 5.250,00</p>
                </div>
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-6">
                    <TrendingDown className="text-rose-600" size={28} />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Despesas do Mês</p>
                  <p className="text-3xl font-bold text-slate-900 tabular-nums">R$ 2.130,00</p>
                </div>
                <div className="bg-indigo-600 p-8 rounded-3xl transition-all hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                    <Wallet className="text-white" size={28} />
                  </div>
                  <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Saldo Total</p>
                  <p className="text-3xl font-bold text-white tabular-nums">R$ 3.120,00</p>
                </div>
              </div>
              <div className="mt-10 pt-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2 text-slate-400">
                  <CheckCircle size={18} className="text-indigo-500" />
                  <span className="text-sm font-medium italic">Dados atualizados em tempo real</span>
                </div>
                <div className="flex -space-x-3 overflow-hidden">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-white bg-slate-200 border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                      User
                    </div>
                  ))}
                  <div className="inline-block h-10 w-10 rounded-full ring-4 ring-white bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 uppercase">
                    +2k
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Recursos de elite para sua economia
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              Tudo que você precisa para gerenciar suas finanças pessoais com precisão cirúrgica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group p-10 bg-white rounded-[32px] border border-slate-100 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-50 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-[60px] opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10" />
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 text-indigo-600 transition-transform group-hover:scale-110 group-hover:rotate-3">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              A escolha de quem busca excelência
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              Junte-se a milhares de usuários que elevaram seu controle financeiro a um novo patamar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                    <span className="text-white font-bold text-lg">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">{testimonial.name}</p>
                    <p className="text-sm font-bold text-indigo-500 uppercase tracking-widest">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-600 italic text-lg leading-relaxed">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-50" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8 tracking-tight">
            Pronto para dominar suas finanças?
          </h2>
          <p className="text-xl text-slate-400 mb-12 font-medium">
            Cadastre-se agora e comece a transformar sua vida financeira hoje mesmo.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-slate-900 px-12 py-5 rounded-2xl hover:bg-slate-50 transition-all font-bold flex items-center justify-center gap-2 shadow-2xl mx-auto text-lg active:scale-[0.98]"
          >
            Criar minha conta gratuita <ArrowRight size={22} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-white to-slate-50 border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between mb-12">
            {/* Branding - Left */}
            <div className="flex-shrink-0 w-full md:w-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Wallet className="text-white" size={22} />
                </div>
                <span className="text-xl font-bold text-slate-900">MoneySense</span>
              </div>
              <p className="text-sm text-slate-600 max-w-xs">
                Seu gerenciador financeiro pessoal para controlar receitas, despesas e alcançar seus objetivos.
              </p>
            </div>

            {/* Links - Right */}
            <div className="grid grid-cols-2 gap-8 w-full md:w-auto md:flex md:items-start md:gap-60">
              {/* Produto */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Produto</h3>
                <ul className="space-y-3">
                  <li><a href="#features" className="text-sm text-slate-600 hover:text-indigo-600 transition hover:underline">Recursos</a></li>
                  <li><a href="#testimonials" className="text-sm text-slate-600 hover:text-indigo-600 transition hover:underline">Depoimentos</a></li>
                  <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition hover:underline">Segurança</a></li>
                </ul>
              </div>

              {/* Conta */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Conta</h3>
                <ul className="space-y-3">
                  <li><button onClick={() => navigate('/login')} className="text-sm text-slate-600 hover:text-indigo-600 transition hover:underline">Entrar</button></li>
                  <li><button onClick={() => navigate('/register')} className="text-sm text-slate-600 hover:text-indigo-600 transition hover:underline">Registrar</button></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Legal</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition hover:underline">Privacidade</a></li>
                  <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition hover:underline">Termos de Uso</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200" />

          {/* Bottom */}
          <div className="pt-8 text-center">
            <p className="text-xs text-slate-500">
              © 2026 MoneySense. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
