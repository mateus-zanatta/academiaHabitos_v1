import { useState, useEffect } from 'react'
import Titulo from '../components/Titulo'

function ProgressoCrianca() {
  const [criancas, setCriancas] = useState([])
  const [trilhas, setTrilhas] = useState([])
  const [criancaSelecionada, setCriancaSelecionada] = useState(null)

  useEffect(() => {
    carregarCriancas()
  }, [])

  async function carregarCriancas() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'))
    // Se não tiver usuário logado (refresh da página), evita erro
    if (!usuarioLogado) return; 

    try {
      const resposta = await fetch(`http://localhost:3001/criancas?responsavelId=${usuarioLogado.id}`)
      const criancasData = await resposta.json()
      setCriancas(criancasData)
    } catch (error) {
      console.error('Erro ao carregar crianças:', error)
    }
  }

  async function carregarTrilhas(criancaId) {
    try {
      // AQUI ESTAVA O PROBLEMA:
      // Adicionei '&_embed=tarefas' para trazer as tarefas junto com a trilha
      const resposta = await fetch(`http://localhost:3001/trilhas?criancaId=${criancaId}&_embed=tarefas`)
      const trilhasData = await resposta.json()
      
      setTrilhas(trilhasData)
      setCriancaSelecionada(criancas.find(c => c.id === criancaId))
    } catch (error) {
      console.error('Erro ao carregar trilhas:', error)
    }
  }

  function calcularProgresso(trilha) {
    // Proteção: Se não tiver tarefas, retorna 0 para não dividir por zero
    if (!trilha.tarefas || trilha.tarefas.length === 0) return 0
    
    const tarefasCompletas = trilha.tarefas.filter(t => t.completada).length
    return (tarefasCompletas / trilha.tarefas.length) * 100
  }

  return (
    <>
      <Titulo />
      <div className="max-w-[1200px] mx-auto p-4 md:p-8">
        
        {/* Header */}
        <div className="text-center mb-12 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-8 rounded-3xl shadow-xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">📊 Acompanhar Progresso</h1>
          <p className="text-lg opacity-90">Veja o desenvolvimento das crianças</p>
        </div>

        {/* Seletor de Crianças */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-700 mb-6 border-l-4 border-[#667eea] pl-4">
            Selecione uma criança:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {criancas.map(crianca => (
              <div 
                key={crianca.id} 
                onClick={() => carregarTrilhas(crianca.id)}
                className={`
                  p-6 rounded-2xl shadow-md cursor-pointer transition-all flex items-center gap-4
                  border-2 hover:-translate-y-1 hover:shadow-lg
                  ${criancaSelecionada?.id === crianca.id 
                    ? 'border-[#667eea] bg-[#f8f9ff] ring-2 ring-[#667eea]/20' 
                    : 'border-transparent bg-white hover:border-gray-200'}
                `}
              >
                <div className="text-5xl">{crianca.avatar}</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{crianca.nome}</h4>
                  <p className="text-gray-500 text-sm mb-1">{crianca.idade} anos</p>
                  <div className="flex gap-2 text-xs font-bold bg-gray-100 p-2 rounded-lg">
                    <span>⭐ {crianca.pontos || 0}</span>
                    <span className="text-gray-400">|</span>
                    <span>🎯 {crianca.tarefasCompletas || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Área de Detalhes da Criança Selecionada */}
        {criancaSelecionada && (
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-fade-in">
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-8 border-b border-gray-100 gap-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Progresso de <span className="text-[#667eea]">{criancaSelecionada.nome}</span>
              </h2>
              
              <div className="flex gap-4 md:gap-8 bg-gray-50 p-4 rounded-2xl">
                <div className="text-center px-4 border-r border-gray-200 last:border-0">
                  <span className="block text-3xl font-bold text-[#667eea]">{criancaSelecionada.pontos || 0}</span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pontos</span>
                </div>
                <div className="text-center px-4 border-r border-gray-200 last:border-0">
                  <span className="block text-3xl font-bold text-[#667eea]">{criancaSelecionada.tarefasCompletas || 0}</span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Completas</span>
                </div>
                <div className="text-center px-4">
                  <span className="block text-3xl font-bold text-[#667eea]">{trilhas.length}</span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trilhas</span>
                </div>
              </div>
            </div>

            {trilhas.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 grayscale opacity-50">📝</div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">Nenhuma trilha encontrada</h3>
                <p className="text-gray-400">Crie algumas trilhas para {criancaSelecionada.nome} começar!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {trilhas.map(trilha => {
                  const progresso = calcularProgresso(trilha)
                  return (
                    <div key={trilha.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      
                      {/* Header da Trilha + Porcentagem */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl bg-white p-2 rounded-lg shadow-sm">{trilha.icone}</span>
                          <h3 className="text-xl font-bold text-gray-800">{trilha.titulo}</h3>
                        </div>
                        <span className="text-2xl font-bold text-[#667eea]">{Math.round(progresso)}%</span>
                      </div>
                      
                      {/* Barra de Progresso Customizada */}
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-6">
                        <div 
                          className="h-full bg-gradient-to-r from-[#667eea] to-[#764ba2] transition-all duration-1000 ease-out rounded-full" 
                          style={{ width: `${progresso}%` }}
                        ></div>
                      </div>

                      {/* Lista de Tarefas (Grid Compacto) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {trilha.tarefas?.map(tarefa => (
                          <div key={tarefa.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                            <span className={`text-lg ${tarefa.completada ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                              {tarefa.completada ? '✅' : '⏳'}
                            </span>
                            <span className={`flex-1 font-medium ${tarefa.completada ? 'text-gray-800 line-through decoration-gray-400 decoration-2' : 'text-gray-600'}`}>
                              {tarefa.titulo}
                            </span>
                            <span className="text-xs font-bold bg-[#667eea]/10 text-[#667eea] px-2 py-1 rounded">
                              +{tarefa.pontos}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default ProgressoCrianca