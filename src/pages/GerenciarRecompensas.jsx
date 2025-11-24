import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Titulo from '../components/Titulo'

function GerenciarRecompensas() {
  const { register, handleSubmit, reset } = useForm()
  const [recompensas, setRecompensas] = useState([])
  const [criancas, setCriancas] = useState([])

  useEffect(() => {
    carregarRecompensas()
    carregarCriancas()
  }, [])

  async function carregarRecompensas() {
    try {
      const resposta = await fetch('http://localhost:3001/recompensas')
      const dados = await resposta.json()
      setRecompensas(dados)
    } catch (error) {
      console.error('Erro ao carregar recompensas:', error)
    }
  }

  async function carregarCriancas() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'))
    try {
      const resposta = await fetch(`http://localhost:3001/criancas?responsavelId=${usuarioLogado.id}`)
      const dados = await resposta.json()
      setCriancas(dados)
    } catch (error) {
      console.error('Erro ao carregar crianças:', error)
    }
  }

  async function criarRecompensa(data) {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'))
    
    const novaRecompensa = {
      titulo: data.titulo,
      descricao: data.descricao,
      pontos: parseInt(data.pontos),
      icone: data.icone,
      responsavelId: usuarioLogado.id,
      criancaId: data.criancaId ? parseInt(data.criancaId) : null, // null = para todas
      ativa: true,
      dataCriacao: new Date().toISOString()
    }

    try {
      const resposta = await fetch('http://localhost:3001/recompensas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaRecompensa)
      })

      if (resposta.ok) {
        const recompensaSalva = await resposta.json()
        setRecompensas([...recompensas, recompensaSalva])
        alert('🎁 Recompensa criada com sucesso!')
        reset()
      }
    } catch (error) {
      console.error('Erro ao criar recompensa:', error)
      alert('Erro ao criar recompensa')
    }
  }

  async function toggleRecompensa(recompensaId, ativa) {
    try {
      const resposta = await fetch(`http://localhost:3001/recompensas/${recompensaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativa: !ativa })
      })

      if (resposta.ok) {
        carregarRecompensas()
      }
    } catch (error) {
      console.error('Erro ao atualizar recompensa:', error)
    }
  }

  async function excluirRecompensa(recompensaId) {
    if (confirm('Tem certeza que deseja excluir esta recompensa?')) {
      try {
        await fetch(`http://localhost:3001/recompensas/${recompensaId}`, {
          method: 'DELETE'
        })
        carregarRecompensas()
      } catch (error) {
        console.error('Erro ao excluir recompensa:', error)
      }
    }
  }

  function getCriancaNome(criancaId) {
    if (!criancaId) return 'Todas as crianças'
    const crianca = criancas.find(c => c.id === criancaId)
    return crianca ? crianca.nome : 'Criança não encontrada'
  }

  return (
    <>
      <Titulo />
      <div className="max-w-[1200px] mx-auto p-4 md:p-8">
        <div className="text-center mb-12 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-8 rounded-3xl shadow-xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">🎁 Gerenciar Recompensas</h1>
          <p className="text-lg opacity-90">Crie recompensas que suas crianças podem resgatar com os pontos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna da Esquerda: Formulário */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                ➕ Criar Nova Recompensa
              </h3>
              <form onSubmit={handleSubmit(criarRecompensa)} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Título:</label>
                  <input 
                    type="text" 
                    required 
                    {...register('titulo')}
                    placeholder="Ex: Passeio no Parque"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#667eea]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Descrição:</label>
                  <textarea 
                    {...register('descricao')}
                    placeholder="Detalhes..."
                    rows="3"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#667eea] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Pontos:</label>
                    <input 
                      type="number" 
                      required 
                      min="1"
                      {...register('pontos')}
                      placeholder="100"
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#667eea]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Ícone:</label>
                    <select 
                      {...register('icone')} 
                      defaultValue="🎁"
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#667eea]"
                    >
                      <option value="🎁">Presente</option>
                      <option value="🍦">Sorvete</option>
                      <option value="🎮">Game</option>
                      <option value="🎬">Cinema</option>
                      <option value="🏆">Troféu</option>
                      <option value="🎪">Parque</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Para quem? (Opcional)</label>
                  <select 
                    {...register('criancaId')}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#667eea]"
                  >
                    <option value="">Todas as crianças</option>
                    {criancas.map(crianca => (
                      <option key={crianca.id} value={crianca.id}>
                        {crianca.avatar} {crianca.nome}
                      </option>
                    ))}
                  </select>
                  <small className="text-gray-400 text-xs block mt-1">Deixe em branco para todos</small>
                </div>

                <button type="submit" className="w-full py-3 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-bold rounded-xl shadow-md hover:-translate-y-1 transition-all">
                  🎯 Criar Recompensa
                </button>
              </form>
            </div>
          </div>

          {/* Coluna da Direita: Lista */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-[#667eea] pl-4">
              📋 Recompensas Cadastradas
            </h3>
            
            {recompensas.length === 0 ? (
              <div className="text-center p-12 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <div className="text-6xl mb-4 grayscale opacity-50">🎁</div>
                <h4 className="text-xl font-bold text-gray-600 mb-2">Nenhuma recompensa criada</h4>
                <p className="text-gray-400">Crie sua primeira recompensa para motivar suas crianças!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recompensas.map(recompensa => (
                  <div 
                    key={recompensa.id} 
                    className={`bg-white p-6 rounded-2xl shadow-md border-2 transition-all hover:shadow-xl ${recompensa.ativa ? 'border-transparent' : 'border-gray-200 opacity-75'}`}
                  >
                    <div className="flex gap-4 mb-4">
                      <span className="text-4xl bg-gray-50 p-3 rounded-xl h-fit">{recompensa.icone}</span>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-800 mb-1">{recompensa.titulo}</h4>
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{recompensa.descricao}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-[#667eea]/10 text-[#667eea] px-3 py-1 rounded-md text-xs font-bold">
                            ⭐ {recompensa.pontos} pontos
                          </span>
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-bold">
                            👶 {getCriancaNome(recompensa.criancaId) || 'Todos'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => toggleRecompensa(recompensa.id, recompensa.ativa)}
                        className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${
                          recompensa.ativa 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {recompensa.ativa ? '✅ Ativa' : '❌ Inativa'}
                      </button>
                      <button 
                        onClick={() => excluirRecompensa(recompensa.id)}
                        className="px-4 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default GerenciarRecompensas