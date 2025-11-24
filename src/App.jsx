import { useEffect, useState } from 'react'
import Titulo from './components/Titulo'

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null)

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const usuarioSalvo = localStorage.getItem('usuarioLogado')
    const criancaSalva = localStorage.getItem('criancaLogada')
    
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo))
    } else if (criancaSalva) {
      setUsuarioLogado(JSON.parse(criancaSalva))
    }
  }, [])

  function handleLogout() {
    localStorage.removeItem('usuarioLogado')
    localStorage.removeItem('criancaLogada')
    setUsuarioLogado(null)
    window.location.href = '/'
  }

  function handleContinuarApp() {
    if (usuarioLogado) {
      window.location.href = '/selecao-perfil'
    } else {
      window.location.href = '/login'
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] font-sans pb-10">
      <Titulo usuario={usuarioLogado} onLogout={handleLogout} />
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="relative mt-8 mb-16 rounded-[25px] overflow-hidden shadow-2xl bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-8 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[length:30px_30px]"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 drop-shadow-md">
              Transforme Rotinas em Aventuras! 🎯
            </h1>
            <p className="text-lg md:text-xl font-light opacity-95 mb-10 leading-relaxed">
              A plataforma que torna as tarefas diárias das crianças em missões divertidas e recompensadoras
            </p>
            {usuarioLogado ? (
              <div className="bg-white/15 backdrop-blur-md p-8 rounded-2xl border border-white/20">
                <p className="text-xl mb-6 text-center">
                  Que bom te ver de novo, <strong className="font-bold">{usuarioLogado.nome}</strong>! 🎉
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={handleContinuarApp} className="px-8 py-4 rounded-full font-bold text-[#333] bg-gradient-to-br from-[#ff6b6b] to-[#ffd93d] shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-2">
                    Continuar para o App 🚀
                  </button>
                  <button onClick={handleLogout} className="px-8 py-4 rounded-full font-bold text-white bg-white/20 border-2 border-white/30 backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white/30">
                    Sair da Conta
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => window.location.href = '/login'} className="px-8 py-4 rounded-full font-bold text-[#333] bg-gradient-to-br from-[#ff6b6b] to-[#ffd93d] shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
                  Fazer Login
                </button>
                <button onClick={() => window.location.href = '/registro'} className="px-8 py-4 rounded-full font-bold text-white bg-white/20 border-2 border-white/30 backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white/30">
                  Criar Conta
                </button>
              </div>
            )}
          </div>
          <div className="relative h-[300px] hidden md:block">
            <div className="absolute top-[20%] left-[10%] bg-white/15 backdrop-blur-md p-6 rounded-2xl border border-white/20 font-semibold text-lg animate-float-slow">
              🎯 Missões
            </div>
            <div className="absolute top-[50%] right-[10%] bg-white/15 backdrop-blur-md p-6 rounded-2xl border border-white/20 font-semibold text-lg animate-float-medium">
              ⭐ Pontos
            </div>
            <div className="absolute bottom-[10%] left-[30%] bg-white/15 backdrop-blur-md p-6 rounded-2xl border border-white/20 font-semibold text-lg animate-float-fast">
              🏆 Recompensas
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
          <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#667eea] to-[#764ba2]"></div>
            <div className="text-6xl mb-6 transform transition-transform group-hover:scale-110">👶</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Para Crianças</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">Interface colorida e divertida onde cada tarefa vira uma missão emocionante</p>
            <ul className="text-gray-600 space-y-2 text-left">
              <li>🎮 Sistema de pontos gamificado</li>
              <li>🏆 Conquistas e recompensas</li>
              <li>📱 Design amigável e intuitivo</li>
            </ul>
          </div>
          <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#667eea] to-[#764ba2]"></div>
            <div className="text-6xl mb-6 transform transition-transform group-hover:scale-110">👨‍👩‍👧‍👦</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Para Pais</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">Controle total sobre as atividades e acompanhamento do progresso</p>
            <ul className="text-gray-600 space-y-2 text-left">
              <li>📊 Dashboard de progresso</li>
              <li>🎯 Criação de tarefas personalizadas</li>
              <li>📱 Acompanhamento em tempo real</li>
            </ul>
          </div>
          <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#667eea] to-[#764ba2]"></div>
            <div className="text-6xl mb-6 transform transition-transform group-hover:scale-110">💫</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Para Famílias</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">Fortalecendo laços através de rotinas saudáveis e divertidas</p>
            <ul className="text-gray-600 space-y-2 text-left">
              <li>🤝 Desenvolvimento de hábitos</li>
              <li>❤️ Melhora na comunicação familiar</li>
              <li>🎉 Celebração de conquistas juntos</li>
            </ul>
          </div>
        </div>
        <div className="text-center my-24">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">Escolha o Plano Perfeito para Sua Família 💫</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-transparent transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Grátis</h3>
                <div className="text-4xl font-bold text-[#667eea] my-2">R$ 0</div>
                <span className="text-gray-500 text-sm">para sempre</span>
              </div>
              <ul className="space-y-3 mb-8 text-left text-gray-600 border-t border-b border-gray-100 py-6">
                <li>✅ Até 2 crianças</li>
                <li>✅ 5 tarefas por criança</li>
                <li>✅ Sistema básico de pontos</li>
                <li>✅ Acompanhamento simples</li>
                <li className="opacity-50">❌ Recompensas personalizadas</li>
                <li className="opacity-50">❌ Relatórios detalhados</li>
              </ul>
              <button onClick={() => window.location.href = '/registro'} className="w-full py-3 border-2 border-[#667eea] text-[#667eea] rounded-full font-bold transition-all hover:bg-[#667eea] hover:text-white hover:-translate-y-1">
                Começar Grátis
              </button>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-[#667eea] relative transform md:scale-110 z-10 transition-all duration-300 hover:-translate-y-2">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-6 py-1 rounded-full text-sm font-bold shadow-md">
                Mais Popular
              </div>
              <div className="mb-8 mt-2">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Premium</h3>
                <div className="text-4xl font-bold text-[#667eea] my-2">R$ 19,90</div>
                <span className="text-gray-500 text-sm">por mês</span>
              </div>
              <ul className="space-y-3 mb-8 text-left text-gray-600 border-t border-b border-gray-100 py-6">
                <li>✅ Crianças ilimitadas</li>
                <li>✅ Tarefas ilimitadas</li>
                <li>✅ Sistema avançado de pontos</li>
                <li>✅ Recompensas personalizadas</li>
                <li>✅ Relatórios detalhados</li>
                <li>✅ Suporte prioritário</li>
              </ul>
              <button onClick={() => window.location.href = '/registro'} className="w-full py-3 bg-[#667eea] text-white rounded-full font-bold transition-all hover:bg-[#5a6fd8] hover:-translate-y-1 shadow-md">
                Assinar Premium
              </button>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-transparent transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Família</h3>
                <div className="text-4xl font-bold text-[#667eea] my-2">R$ 29,90</div>
                <span className="text-gray-500 text-sm">por mês</span>
              </div>
              <ul className="space-y-3 mb-8 text-left text-gray-600 border-t border-b border-gray-100 py-6">
                <li>✅ Todas as features Premium</li>
                <li>✅ Até 3 famílias conectadas</li>
                <li>✅ Competições saudáveis</li>
                <li>✅ Dashboard familiar</li>
                <li>✅ Eventos e desafios especiais</li>
                <li>✅ Consultoria personalizada</li>
              </ul>
              <button onClick={() => window.location.href = '/registro'} className="w-full py-3 border-2 border-[#667eea] text-[#667eea] rounded-full font-bold transition-all hover:bg-[#667eea] hover:text-white hover:-translate-y-1">
                Escolher Família
              </button>
            </div>
          </div>
        </div>
        {!usuarioLogado && (
          <div className="text-center p-8 md:p-16 bg-gradient-to-br from-[#ff6b6b] to-[#ffd93d] rounded-[25px] my-16 text-[#333] shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para Transformar a Rotina da Sua Família? 🚀</h2>
            <p className="text-xl opacity-90 mb-10">Junte-se a mais de 10.000 famílias que já descobriram o segredo para tornar as tarefas divertidas</p>
            
            <div className="flex justify-center mb-10">
              <button onClick={() => window.location.href = '/registro'} className="px-10 py-5 rounded-full font-bold text-white bg-[#333] shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl text-lg">
                Começar Agora - É Grátis!
              </button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              <span className="bg-white/30 px-4 py-2 rounded-full font-medium text-sm md:text-base">⭐ 4.9/5 - Avaliado por 2.000+ famílias</span>
              <span className="bg-white/30 px-4 py-2 rounded-full font-medium text-sm md:text-base">👨‍👩‍👧‍👦 10.000+ famílias felizes</span>
              <span className="bg-white/30 px-4 py-2 rounded-full font-medium text-sm md:text-base">🔒 100% seguro e privado</span>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default App