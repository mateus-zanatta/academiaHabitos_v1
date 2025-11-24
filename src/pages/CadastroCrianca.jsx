import { useForm } from 'react-hook-form'
import { useState } from 'react'
import Titulo from '../components/Titulo'

function CadastroCrianca() {
  const { register, handleSubmit, reset } = useForm()
  const [criancas, setCriancas] = useState([])

  function gerarToken() {
    return Math.floor(1000 + Math.random() * 9000).toString()
  }

  async function cadastrarCrianca(data) {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'))
    
    const novaCrianca = {
      nome: data.nome,
      idade: parseInt(data.idade),
      token: gerarToken(),
      responsavelId: usuarioLogado.id,
      pontos: 0,
      tarefasCompletas: 0,
      dataCadastro: new Date().toISOString(),
      avatar: data.avatar || '👶'
    }

    try {
      const resposta = await fetch('http://localhost:3001/criancas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaCrianca)
      })

      if (resposta.ok) {
        const criancaSalva = await resposta.json()
        setCriancas([...criancas, criancaSalva])
        alert(`✅ Criança cadastrada com sucesso!\nToken de acesso: ${criancaSalva.token}`)
        reset()
      }
    } catch (error) {
      console.error('Erro ao cadastrar criança:', error)
      alert('Erro ao cadastrar criança')
    }
  }

  return (
    <>
      <Titulo />
      <div className="max-w-[1200px] mx-auto p-4 md:p-8">
        
        {/* Header */}
        <div className="text-center mb-12 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-8 rounded-3xl shadow-xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">👶 Cadastrar Nova Criança</h1>
          <p className="text-lg opacity-90">Adicione uma criança para começar a usar o sistema</p>
        </div>

        {/* Form Container */}
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit(cadastrarCrianca)} className="bg-white p-8 rounded-3xl shadow-lg mb-12 border border-gray-100">
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Nome da Criança:</label>
              <input 
                type="text" 
                required 
                {...register('nome')}
                placeholder="Digite o nome da criança"
                className="w-full p-4 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 transition-all"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Idade:</label>
              <input 
                type="number" 
                min="3" 
                max="12" 
                required 
                {...register('idade')}
                placeholder="Idade entre 3 e 12 anos"
                className="w-full p-4 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 transition-all"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-2">Avatar:</label>
              <select 
                {...register('avatar')} 
                defaultValue="👶"
                className="w-full p-4 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 transition-all cursor-pointer"
              >
                <option value="👶">Bebê</option>
                <option value="👦">Menino</option>
                <option value="👧">Menina</option>
                <option value="🦸">Super-herói</option>
                <option value="🧙">Mago</option>
                <option value="🐱">Gatinho</option>
                <option value="🐶">Cachorrinho</option>
              </select>
            </div>

            <button type="submit" className="w-full py-4 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-bold rounded-xl shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all">
              🎯 Cadastrar Criança
            </button>
          </form>

          {/* Lista de Crianças */}
          {criancas.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-[#667eea] pl-4">
                🎪 Crianças Cadastradas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {criancas.map(crianca => (
                  <div key={crianca.id} className="bg-white p-6 rounded-2xl shadow-md border-2 border-transparent hover:border-[#667eea] hover:-translate-y-1 transition-all flex items-center gap-4 cursor-default">
                    <div className="text-5xl">{crianca.avatar}</div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{crianca.nome}</h4>
                      <p className="text-gray-500 mb-2">{crianca.idade} anos</p>
                      <span className="inline-block bg-[#667eea] text-white px-3 py-1 rounded-md text-sm font-bold tracking-wider">
                        Token: {crianca.token}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default CadastroCrianca