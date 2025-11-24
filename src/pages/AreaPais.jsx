import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Titulo from '../components/Titulo'

function AreaPais() {
  const [criancas, setCriancas] = useState([])
  const [trilhas, setTrilhas] = useState([])

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resCriancas, resTrilhas] = await Promise.all([
          fetch('http://localhost:3001/criancas'),
          fetch('http://localhost:3001/trilhas')
        ])
        
        const criancasData = await resCriancas.json()
        const trilhasData = await resTrilhas.json()
        
        setCriancas(criancasData)
        setTrilhas(trilhasData)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      }
    }
    carregarDados()
  }, [])

  const totalTarefas = 0;

  return (
    <>
      <Titulo />
      <div className="max-w-[1200px] mx-auto p-4 md:p-8">
        
        {/* Header da Página */}
        <div className="text-center mb-12 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-8 md:p-12 rounded-3xl shadow-xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">👨‍👩‍👧‍👦 Área dos Responsáveis</h1>
          <p className="text-lg md:text-xl opacity-90">Gerencie as rotinas e acompanhe o progresso dos seus filhos</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Card Recompensas (Warning/Amarelo) */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 border-t-4 border-yellow-400 text-center transition-all hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center">
            <div className="text-5xl mb-4">🎁</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Recompensas</h3>
            <p className="text-gray-600 mb-6 flex-grow">Crie recompensas que as crianças podem resgatar com pontos</p>
            <Link to="/recompensas" className="bg-[#667eea] text-white px-6 py-3 rounded-full font-bold hover:bg-[#5a6fd8] transition-colors w-full">
              Gerenciar
            </Link>
          </div>

          {/* Card Crianças (Primary/Roxo) */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 border-t-4 border-[#667eea] text-center transition-all hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center">
            <div className="text-5xl mb-4">👶</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Gerenciar Crianças</h3>
            <p className="text-gray-600 mb-6 flex-grow">Cadastre e gerencie os perfis das crianças</p>
            <Link to="/cadastro-crianca" className="bg-[#667eea] text-white px-6 py-3 rounded-full font-bold hover:bg-[#5a6fd8] transition-colors w-full">
              Cadastrar
            </Link>
          </div>

          {/* Card Trilhas (Secondary/Rosa) */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 border-t-4 border-pink-400 text-center transition-all hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Criar Trilhas</h3>
            <p className="text-gray-600 mb-6 flex-grow">Crie rotinas e tarefas personalizadas</p>
            <Link to="/criar-trilha" className="bg-[#667eea] text-white px-6 py-3 rounded-full font-bold hover:bg-[#5a6fd8] transition-colors w-full">
              Nova Trilha
            </Link>
          </div>

          {/* Card Progresso (Success/Verde) */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 border-t-4 border-[#4ecdc4] text-center transition-all hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ver Progresso</h3>
            <p className="text-gray-600 mb-6 flex-grow">Acompanhe o desenvolvimento das crianças</p>
            <Link to="/progresso" className="bg-[#667eea] text-white px-6 py-3 rounded-full font-bold hover:bg-[#5a6fd8] transition-colors w-full">
              Ver Progresso
            </Link>
          </div>
        </div>

        {/* Stats Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center border border-gray-50">
            <span className="block text-4xl font-bold text-[#667eea] mb-2">{criancas.length}</span>
            <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">Crianças Cadastradas</span>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center border border-gray-50">
            <span className="block text-4xl font-bold text-[#667eea] mb-2">{trilhas.length}</span>
            <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">Trilhas Criadas</span>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center border border-gray-50">
            <span className="block text-4xl font-bold text-[#667eea] mb-2">{totalTarefas}</span>
            <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">Tarefas Ativas</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default AreaPais