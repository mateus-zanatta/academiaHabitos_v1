import { useForm } from 'react-hook-form'
import { useState } from 'react'
import Titulo from '../components/Titulo'

function CriarTrilha() {
  const { register, handleSubmit, reset } = useForm()
  const [criancas, setCriancas] = useState([])
  const [tarefas, setTarefas] = useState([])

  useState(() => {
    carregarCriancas()
  }, [])

  async function carregarCriancas() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'))
    try {
      const resposta = await fetch(`http://localhost:3001/criancas?responsavelId=${usuarioLogado.id}`)
      const criancasData = await resposta.json()
      setCriancas(criancasData)
    } catch (error) {
      console.error('Erro ao carregar crianças:', error)
    }
  }

  function adicionarTarefa(data) {
    const novaTarefa = {
      id: Date.now(),
      titulo: data.tituloTarefa,
      descricao: data.descricaoTarefa,
      pontos: parseInt(data.pontosTarefa),
      icone: data.iconeTarefa,
      repetir: data.repetirTarefa || 'diaria'
    }
    setTarefas([...tarefas, novaTarefa])
    reset({
      tituloTarefa: '',
      descricaoTarefa: '',
      pontosTarefa: 10,
      iconeTarefa: '✅'
    })
  }

  async function salvarTrilha(data) {
    if (tarefas.length === 0) {
      alert('Adicione pelo menos uma tarefa à trilha!')
      return
    }

    const novaTrilha = {
      titulo: data.tituloTrilha,
      descricao: data.descricaoTrilha,
      criancaId: parseInt(data.criancaId),
      icone: data.iconeTrilha,
      tarefas: tarefas,
      dataCriacao: new Date().toISOString(),
      ativa: true
    }

    try {
      const resposta = await fetch('http://localhost:3001/trilhas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaTrilha)
      })

      if (resposta.ok) {
        alert('🎉 Trilha criada com sucesso!')
        setTarefas([])
        reset()
      }
    } catch (error) {
      console.error('Erro ao criar trilha:', error)
      alert('Erro ao criar trilha')
    }
  }

  function removerTarefa(tarefaId) {
    setTarefas(tarefas.filter(t => t.id !== tarefaId))
  }

  return (
    <>
      <Titulo />
      <div className="max-w-[1200px] mx-auto p-4 md:p-8">
        <div className="text-center mb-12 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-8 rounded-3xl shadow-xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">🎯 Criar Nova Trilha</h1>
          <p className="text-lg opacity-90">Crie uma sequência de tarefas para seu filho</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit(salvarTrilha)} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            
            {/* Inputs Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Título da Trilha:</label>
                <input 
                  type="text" 
                  required 
                  {...register('tituloTrilha')}
                  placeholder="Ex: Rotina Matinal"
                  className="w-full p-4 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-[#667eea] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Ícone:</label>
                <select 
                  {...register('iconeTrilha')} 
                  defaultValue="🎯"
                  className="w-full p-4 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-[#667eea] transition-all"
                >
                  <option value="🎯">Alvo</option>
                  <option value="⭐">Estrela</option>
                  <option value="🏆">Troféu</option>
                  <option value="🚀">Foguete</option>
                  <option value="🌈">Arco-íris</option>
                  <option value="🐉">Dragão</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Descrição:</label>
              <textarea 
                {...register('descricaoTrilha')}
                placeholder="Descreva o objetivo desta trilha..."
                rows="3"
                className="w-full p-4 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-[#667eea] transition-all resize-none"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-2">Para qual criança?</label>
              <select 
                {...register('criancaId')} 
                required
                className="w-full p-4 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-[#667eea] transition-all"
              >
                <option value="">Selecione uma criança</option>
                {criancas.map(crianca => (
                  <option key={crianca.id} value={crianca.id}>
                    {crianca.avatar} {crianca.nome} ({crianca.idade} anos)
                  </option>
                ))}
              </select>
            </div>

            {/* Seção de Adicionar Tarefas */}
            <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                📝 Adicionar Tarefas
              </h3>
              
              {/* Form Tarefa */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <input 
                      type="text" 
                      {...register('tituloTarefa')}
                      placeholder="Título da tarefa"
                      className="w-full p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#667eea]"
                    />
                  </div>
                  <div>
                    <input 
                      type="number" 
                      {...register('pontosTarefa')}
                      placeholder="Pontos"
                      defaultValue="10"
                      className="w-full p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#667eea]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <textarea 
                      {...register('descricaoTarefa')}
                      placeholder="Descrição da tarefa"
                      rows="1"
                      className="w-full p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#667eea] resize-none"
                    />
                  </div>
                  <div>
                    <select 
                      {...register('iconeTarefa')} 
                      defaultValue="✅"
                      className="w-full p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#667eea]"
                    >
                      <option value="✅">Check</option>
                      <option value="🛏️">Cama</option>
                      <option value="🦷">Dente</option>
                      <option value="🍽️">Comida</option>
                      <option value="📚">Livro</option>
                      <option value="🎮">Game</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={handleSubmit(adicionarTarefa)}
                  className="w-full py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                >
                  ➕ Adicionar Tarefa
                </button>
              </div>

              {/* Lista de Tarefas Adicionadas */}
              {tarefas.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-700 mb-2">Tarefas Adicionadas ({tarefas.length})</h4>
                  {tarefas.map(tarefa => (
                    <div key={tarefa.id} className="flex items-center gap-4 bg-white p-4 rounded-xl border-l-4 border-[#667eea] shadow-sm">
                      <span className="text-2xl">{tarefa.icone}</span>
                      <div className="flex-1">
                        <strong className="block text-gray-800">{tarefa.titulo}</strong>
                        <span className="block text-gray-500 text-sm">{tarefa.descricao}</span>
                        <small className="text-[#667eea] font-bold">{tarefa.pontos} pontos</small>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removerTarefa(tarefa.id)}
                        className="p-2 text-xl hover:bg-red-50 rounded-full transition-colors"
                        title="Remover"
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="w-full py-4 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-bold rounded-xl shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={tarefas.length === 0}
            >
              🚀 Criar Trilha
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default CriarTrilha