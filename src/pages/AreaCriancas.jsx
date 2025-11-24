import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Titulo from '../components/Titulo'
import CardTarefa from '../components/CardTarefa'

function AreaCriancas() {
  const [trilhas, setTrilhas] = useState([])
  const [crianca, setCrianca] = useState(null)

  useEffect(() => {
    const criancaLogada = localStorage.getItem('criancaLogada')
    if (criancaLogada) {
      const criancaData = JSON.parse(criancaLogada)
      setCrianca(criancaData)
      carregarTrilhas(criancaData.id)
      // Força uma atualização dos dados ao carregar a página para garantir sincronia
      atualizarDadosCrianca(criancaData.id)
    }
  }, [])

  async function carregarTrilhas(criancaId) {
    try {
      const resposta = await fetch(`http://localhost:3001/trilhas?criancaId=${criancaId}`)
      const trilhasData = await resposta.json()
      setTrilhas(trilhasData)
    } catch (error) {
      console.error('Erro ao carregar trilhas:', error)
    }
  }

  // NOVA FUNÇÃO: Busca os dados atualizados (pontos) da criança no servidor
  async function atualizarDadosCrianca(id) {
    try {
      const resposta = await fetch(`http://localhost:3001/criancas/${id}`)
      const dadosAtualizados = await resposta.json()
      
      // Atualiza o estado (tela) e o localStorage
      setCrianca(dadosAtualizados)
      localStorage.setItem('criancaLogada', JSON.stringify(dadosAtualizados))
    } catch (error) {
      console.error("Erro ao atualizar pontos:", error)
    }
  }

  // Função chamada quando o CardTarefa termina de marcar como feita
  const handleTarefaCompleta = () => {
    if (crianca) {
      // 1. Recarrega as trilhas (para marcar o check visual)
      carregarTrilhas(crianca.id)
      // 2. Recarrega os dados da criança (para atualizar os pontos no topo)
      atualizarDadosCrianca(crianca.id)
    }
  }

  // TELA DE BLOQUEIO (Se não estiver logado)
  if (!crianca) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border-4 border-red-100">
          <h2 className="text-3xl font-bold text-red-500 mb-4">🚫 Acesso Restrito</h2>
          <p className="text-gray-600 mb-6 text-lg">Você precisa fazer login como criança primeiro!</p>
          <button onClick={() => window.location.href = '/selecao-perfil'} className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold shadow-lg hover:bg-blue-600 hover:-translate-y-1 transition-all">
            Voltar para Seleção
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pb-20">
      <Titulo />
      
      {/* HEADER DA CRIANÇA */}
      <div className="container mx-auto px-4 pt-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-600 mb-3 drop-shadow-sm">
            🎮 Bem-vindo, {crianca.nome}!
          </h1>
          <p className="text-xl text-gray-600 mb-8 font-medium">
            Complete as missões e ganhe recompensas! 🏆
          </p>

          {/* ESTATÍSTICAS (Stats Bar) */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {/* Card Loja */}
            <Link to="/loja" className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md border-2 border-transparent hover:border-yellow-400 hover:-translate-y-1 transition-all group">
              <span className="text-3xl group-hover:scale-110 transition-transform">🛍️</span>
              <span className="font-bold text-gray-700 group-hover:text-yellow-600">Loja de Recompensas</span>
            </Link>

            {/* Card Pontos */}
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md border-2 border-indigo-100 animate-fade-in">
              <span className="text-3xl">⭐</span>
              <span className="font-bold text-indigo-600 text-lg">{crianca.pontos || 0} pontos</span>
            </div>

            {/* Card Missões */}
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md border-2 border-green-100">
              <span className="text-3xl">🎯</span>
              <span className="font-bold text-green-600 text-lg">{crianca.tarefasCompletas || 0} missões</span>
            </div>
          </div>
        </div>

        {/* LISTA DE TRILHAS */}
        {trilhas.length === 0 ? (
          <div className="text-center py-16 bg-white/50 rounded-3xl backdrop-blur-sm border-2 border-dashed border-gray-300 mx-auto max-w-2xl">
            <div className="text-6xl mb-4 animate-bounce">🤔</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Nenhuma missão disponível</h3>
            <p className="text-gray-500">Peça para seus pais criarem algumas missões para você!</p>
          </div>
        ) : (
          <div className="space-y-12 max-w-5xl mx-auto">
            {trilhas.map(trilha => (
              <div key={trilha.id} className="bg-white/40 rounded-[2rem] p-6 md:p-8 backdrop-blur-sm border border-white shadow-sm">
                
                {/* Cabeçalho da Trilha */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-indigo-100">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <span className="text-4xl">{trilha.icone}</span> 
                    {trilha.titulo}
                  </h2>
                  <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-bold border border-indigo-200">
                    {trilha.tarefas?.length || 0} missões
                  </span>
                </div>

                {/* Grid de Tarefas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trilha.tarefas?.map(tarefa => (
                    <CardTarefa 
                      key={tarefa.id} 
                      tarefa={tarefa} 
                      criancaId={crianca.id}
                      onTarefaCompleta={handleTarefaCompleta}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12 opacity-60">
          <p className="text-sm font-bold text-indigo-900">💫 Cada missão completada te aproxima de recompensas incríveis!</p>
        </div>
      </div>
    </div>
  )
}

export default AreaCriancas