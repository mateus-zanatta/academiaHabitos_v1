import { useState, useEffect } from 'react'
import Titulo from '../components/Titulo'

function LojaRecompensas() {
  const [recompensas, setRecompensas] = useState([])
  const [crianca, setCrianca] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const criancaLogada = localStorage.getItem('criancaLogada')
    if (criancaLogada) {
      const criancaData = JSON.parse(criancaLogada)
      setCrianca(criancaData)
      carregarRecompensas(criancaData.id)
    } else {
      setCarregando(false)
    }
  }, [])

  async function carregarRecompensas(criancaId) {
    try {
      setCarregando(true)
      const resposta = await fetch(`http://localhost:3001/recompensas?ativa=true`)
      const todasRecompensas = await resposta.json()
      const recompensasFiltradas = todasRecompensas.filter(r => {
        const ehGeral = !r.criancaId || r.criancaId === "" || r.criancaId === "null";
        const ehDestaCrianca = String(r.criancaId) === String(criancaId);
        
        return ehGeral || ehDestaCrianca;
      })
      
      setRecompensas(recompensasFiltradas)
    } catch (error) {
      console.error('Erro ao carregar recompensas:', error)
    } finally {
      setCarregando(false)
    }
  }

  async function resgatarRecompensa(recompensa) {
    if (!crianca) return

    if (crianca.pontos < recompensa.pontos) {
      alert(`❌ Você precisa de mais ${recompensa.pontos - crianca.pontos} pontos para resgatar esta recompensa!`)
      return
    }

    if (!confirm(`Tem certeza que deseja resgatar "${recompensa.titulo}" por ${recompensa.pontos} pontos?`)) {
      return
    }

    try {
      // Criar registro de resgate
      const resgate = {
        criancaId: crianca.id,
        recompensaId: recompensa.id,
        pontosGastos: recompensa.pontos,
        dataResgate: new Date().toISOString(),
        status: 'pendente'
      }

      await fetch('http://localhost:3001/resgates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resgate)
      })

      // Atualizar pontos da criança
      const criancaAtualizada = {
        ...crianca,
        pontos: crianca.pontos - recompensa.pontos
      }

      await fetch(`http://localhost:3001/criancas/${crianca.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criancaAtualizada)
      })

      // Atualizar localStorage
      setCrianca(criancaAtualizada)
      localStorage.setItem('criancaLogada', JSON.stringify(criancaAtualizada))

      alert(`🎉 Parabéns! Você resgatou "${recompensa.titulo}"!\n\nMostre esta mensagem para seus pais para receber sua recompensa!`)
      carregarRecompensas(crianca.id)
      
    } catch (error) {
      console.error('Erro ao resgatar recompensa:', error)
      alert('Erro ao resgatar recompensa')
    }
  }

  if (!crianca && !carregando) {
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

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col bg-gray-50">
        <div className="text-6xl animate-bounce mb-4">🛍️</div>
        <p className="text-xl font-bold text-gray-500">Carregando recompensas...</p>
      </div>
    )
  }

  return (
    <>
      <Titulo usuario={crianca} />
      <div className="min-h-screen bg-gradient-to-br from-[#ffafbd] to-[#ffc3a0] pb-20">
        
        {/* Header da Loja */}
        <div className="container mx-auto px-4 pt-8">
          <div className="bg-gradient-to-r from-[#ff6b6b] to-[#ffd93d] p-8 md:p-12 rounded-3xl shadow-xl text-center text-[#333] mb-12 transform hover:scale-[1.01] transition-transform duration-300">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-sm">🛍️ Loja de Recompensas</h1>
            <p className="text-xl font-medium opacity-90 mb-8">Use seus pontos para resgatar recompensas incríveis! 🎁</p>
            
            <div className="inline-flex items-center gap-3 bg-white/40 backdrop-blur-md px-8 py-4 rounded-2xl border-2 border-white/50 shadow-inner">
              <span className="text-4xl">⭐</span>
              <span className="text-2xl md:text-3xl font-black text-gray-800">
                {crianca.pontos || 0} <span className="text-lg font-bold opacity-70">pontos disponíveis</span>
              </span>
            </div>
          </div>

          {/* Grid de Produtos */}
          {recompensas.length === 0 ? (
            <div className="text-center py-16 bg-white/60 rounded-3xl backdrop-blur-sm border-2 border-dashed border-white mx-auto max-w-2xl">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Nenhuma recompensa disponível</h3>
              <p className="text-gray-600">Seus pais ainda não criaram recompensas. Peça para eles criarem algumas!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
              {recompensas.map(recompensa => {
                const podeResgatar = crianca.pontos >= recompensa.pontos
                
                return (
                  <div 
                    key={recompensa.id} 
                    className={`
                      relative bg-white rounded-3xl p-6 shadow-lg border-4 transition-all duration-300
                      flex flex-col
                      ${podeResgatar 
                        ? 'border-white hover:-translate-y-2 hover:shadow-2xl hover:border-yellow-300' 
                        : 'border-gray-200 opacity-80 grayscale-[0.5] cursor-not-allowed'}
                    `}
                  >
                    {/* Badge de Preço */}
                    <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-black text-sm shadow-sm z-10">
                      ⭐ {recompensa.pontos}
                    </div>

                    <div className="text-center mb-4 pt-4">
                      <div className="text-6xl mb-4 drop-shadow-md inline-block transform transition-transform hover:scale-110">
                        {recompensa.icone}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 leading-tight mb-2">
                        {recompensa.titulo}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 min-h-[2.5em]">
                        {recompensa.descricao}
                      </p>
                    </div>
                    
                    <div className="mt-auto pt-4">
                      {podeResgatar ? (
                        <button 
                          onClick={() => resgatarRecompensa(recompensa)}
                          className="w-full py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                          🎯 Resgatar Agora!
                        </button>
                      ) : (
                        <div className="w-full py-3 bg-gray-100 text-gray-400 font-bold rounded-xl text-center border border-gray-200 cursor-not-allowed text-sm">
                          ❌ Faltam {recompensa.pontos - crianca.pontos} pontos
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Seção "Como Funciona" */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-lg text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 inline-block border-b-4 border-[#ff6b6b] pb-2">
              💡 Como funciona?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <span className="text-5xl mb-4 block">🎯</span>
                <p className="font-bold text-gray-700">Complete missões para ganhar pontos</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <span className="text-5xl mb-4 block">🛍️</span>
                <p className="font-bold text-gray-700">Escolha suas recompensas favoritas</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <span className="text-5xl mb-4 block">👨‍👩‍👧‍👦</span>
                <p className="font-bold text-gray-700">Mostre para seus pais para receber</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LojaRecompensas