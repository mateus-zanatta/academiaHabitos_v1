
function CardTarefa({ tarefa, criancaId, onTarefaCompleta }) {
  async function marcarComoCompleta() {
    if (tarefa.completada) return

    try {
      // Atualizar tarefa como completa
      const tarefaAtualizada = { ...tarefa, completada: true }
      
      // Atualizar pontos da criança
      const respostaCrianca = await fetch(`http://localhost:3001/criancas/${criancaId}`)
      const crianca = await respostaCrianca.json()
      
      const criancaAtualizada = {
        ...crianca,
        pontos: (crianca.pontos || 0) + tarefa.pontos,
        tarefasCompletas: (crianca.tarefasCompletas || 0) + 1
      }
      
      await fetch(`http://localhost:3001/criancas/${criancaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criancaAtualizada)
      })

      alert(`🎉 Parabéns! Você ganhou ${tarefa.pontos} pontos!`)
      onTarefaCompleta()
      
    } catch (error) {
      console.error('Erro ao completar tarefa:', error)
      alert('Erro ao marcar tarefa como completa')
    }
  }

  return (
    <div 
      className={`
        relative overflow-hidden rounded-xl p-6 border-2 transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-xl shadow-lg
        ${tarefa.completada 
          ? 'bg-gradient-to-br from-[#f8fff8] to-[#e8f5e8] border-[#28a745]' 
          : 'bg-white border-transparent'
        }
      `}
    >
      {/* TRUQUE DO SELO (RIBBON):
         Substituímos o ::before do CSS por esta div condicional.
         É mais fácil de controlar e ler.
      */}
      {tarefa.completada && (
        <div className="absolute top-3 -right-8 bg-[#28a745] text-white px-8 py-1 text-[0.7rem] font-bold rotate-45 shadow-sm z-10">
          ✅ CONCLUÍDA
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-4xl">{tarefa.icone}</span>
        <span className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-4 py-2 rounded-full font-semibold text-sm shadow-md">
          +{tarefa.pontos}
        </span>
      </div>
      
      {/* CONTEÚDO */}
      <div className="mb-4">
        <h3 className="mb-2 text-[#333] text-xl font-bold">
          {tarefa.titulo}
        </h3>
        <p className="text-[#666] leading-relaxed m-0">
          {tarefa.descricao}
        </p>
      </div>
      
      {/* AÇÕES */}
      <div className="mt-4 text-center">
        {!tarefa.completada ? (
          <button 
            onClick={marcarComoCompleta} 
            className="w-full py-3 rounded-full font-bold text-white bg-gradient-to-br from-[#28a745] to-[#20c997] transition-transform duration-300 hover:scale-105 shadow-md active:scale-95"
          >
            ✅ Marcar como Feita
          </button>
        ) : (
          <span className="text-[#28a745] font-bold text-lg inline-flex items-center gap-2 animate-pulse">
            🎉 Concluída!
          </span>
        )}
      </div>
    </div>
  )
}

export default CardTarefa