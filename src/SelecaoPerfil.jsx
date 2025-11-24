import { useEffect, useState } from "react"
import Titulo from './components/Titulo'

function SelecaoPerfil() {
  const [usuario, setUsuario] = useState(null)
  const [tokenCrianca, setTokenCrianca] = useState('')

  useEffect(() => {
    const usuarioLogado = localStorage.getItem("usuarioLogado")
    if (usuarioLogado) {
      setUsuario(JSON.parse(usuarioLogado))
    }
  }, [])

  async function handlePerfilPai() {
    const senha = prompt("Digite sua senha novamente para confirmar:")
    if (senha === usuario.senha) {
      window.location.href = "/area-pais"
    } else {
      alert("Senha incorreta!")
    }
  }

  async function handlePerfilCrianca() {
    if (!tokenCrianca) {
      alert("Digite o token de acesso!")
      return
    }

    try {
      const resposta = await fetch(`http://localhost:3001/criancas?token=${tokenCrianca}`)
      const criancas = await resposta.json()
      
      if (criancas.length > 0) {
        localStorage.setItem('criancaLogada', JSON.stringify(criancas[0]))
        window.location.href = "/area-criancas"
      } else {
        alert("Token inválido! Verifique o token fornecido pelos seus pais.")
      }
    } catch (error) {
      console.error('Erro ao validar token:', error)
      alert("Erro ao validar token")
    }
  }

  if (!usuario) {
    return <div>Carregando...</div>
  }

  return (
    <>
     <Titulo />
      <div className="max-w-md mx-auto my-12 p-10 bg-white rounded-3xl shadow-2xl border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Olá, {usuario?.nome}! 👋</h1>
        <p className="text-center text-gray-500 mb-8">Como você gostaria de acessar?</p>
        
        <div className="space-y-8">
          {/* Opção Pai */}
          <div className="bg-gray-50 p-6 rounded-2xl text-center border-2 border-transparent hover:border-[#667eea] hover:-translate-y-1 transition-all">
            <h3 className="text-xl font-bold text-gray-800 mb-2">👨‍👩‍👧‍👦 Área dos Pais</h3>
            <p className="text-gray-500 mb-6 text-sm">Crie trilhas e acompanhe o progresso</p>
            <button 
              onClick={handlePerfilPai} 
              className="w-full py-3 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Acessar como Responsável
            </button>
          </div>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <span className="relative bg-white px-4 text-gray-500 font-bold">ou</span>
          </div>

          {/* Opção Criança */}
          <div className="bg-gray-50 p-6 rounded-2xl text-center border-2 border-transparent hover:border-[#667eea] hover:-translate-y-1 transition-all">
            <h3 className="text-xl font-bold text-gray-800 mb-2">🎮 Área das Crianças</h3>
            <p className="text-gray-500 mb-6 text-sm">Complete missões e ganhe pontos</p>
            
            <div className="mb-4">
              <input 
                type="text" 
                placeholder="TOKEN"
                value={tokenCrianca}
                onChange={(e) => setTokenCrianca(e.target.value)}
                maxLength="4"
                className="w-full text-center text-2xl font-bold tracking-[0.5em] p-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#667eea] transition-all uppercase"
              />
            </div>
            <button 
              onClick={handlePerfilCrianca} 
              className="w-full py-3 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Acessar como Criança
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SelecaoPerfil