import { useForm } from "react-hook-form"
import Titulo from './components/Titulo'
import { useEffect } from "react"

function Login() {
  const { register, handleSubmit, reset, setFocus } = useForm()

  useEffect(() => {
    // Se já estiver logado, redirecionar
    const usuarioLogado = localStorage.getItem('usuarioLogado')
    const criancaLogada = localStorage.getItem('criancaLogada')
    
    if (usuarioLogado || criancaLogada) {
      window.location.href = '/selecao-perfil'
    }
    
    setFocus("email")
  }, [])

  async function fazerLogin(data) {
    const email = data.email
    const senha = data.senha

    try {
      const resposta = await fetch("http://localhost:3001/usuarios")
      const usuarios = await resposta.json()
      
      const usuario = usuarios.find(u => u.email === email && u.senha === senha)
      
      if (usuario) {
        // Salvar no localStorage para login persistente
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario))
        window.location.href = "/selecao-perfil"
      } else {
        alert("Email ou senha incorretos!")
      }
    } catch (erro) {
      console.log(`Erro: ${erro.message}`)
      alert("Erro ao conectar com o servidor. Verifique se o JSON Server está rodando.")
    }
    reset()
  }

  return (
    <>
      <Titulo />
      <div className="max-w-md mx-auto my-12 p-10 bg-white rounded-3xl shadow-2xl border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Login</h1>
        
        <form onSubmit={handleSubmit(fazerLogin)} className="space-y-6 mt-8">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email:</label>
            <input 
              type="email" 
              id="email" 
              required
              className="w-full p-4 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 transition-all" 
              {...register("email")}
            />
          </div>
          
          <div>
            <label htmlFor="senha" className="block text-sm font-bold text-gray-700 mb-2">Senha:</label>
            <input 
              type="password" 
              id="senha" 
              required
              className="w-full p-4 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 transition-all"
              {...register("senha")} 
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <input 
              type="submit" 
              value="Entrar" 
              className="w-full py-4 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-bold rounded-xl cursor-pointer shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all" 
            />
            <a 
              href="/registro" 
              className="w-full py-4 text-center bg-gray-500 text-white font-bold rounded-xl hover:bg-gray-600 hover:-translate-y-1 transition-all"
            >
              Criar Conta
            </a>
          </div>
        </form>
      </div>
    </>
  )
}

export default Login