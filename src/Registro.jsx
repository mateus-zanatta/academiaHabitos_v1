import { useEffect } from 'react'
import { useForm } from "react-hook-form"
import Titulo from './components/Titulo.jsx'

function Registro() {
  const { register, handleSubmit, reset, setFocus } = useForm()

  async function cadastrarUsuario(data) {
    const nome = data.nome
    const email = data.email
    const senha = data.senha

    try {
      const resposta = await fetch("http://localhost:3001/usuarios", {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({
          nome, email, senha, tipo: 'pai',
          dataCriacao: new Date().toISOString()
        })
      })
      if (!resposta.ok) throw new Error("Erro ao criar usuário")
      const novoUsuario = await resposta.json()
      alert(`🎉 Conta de responsável criada com sucesso!`)
      window.location.href = "/login"
    } catch (erro) {
      console.log(`Erro: ${erro.message}`)
      alert("Erro ao criar conta. Verifique se o JSON Server está rodando.")
    }
    reset()
  }

  useEffect(() => {
    setFocus("nome")
  }, [])

  return (
    <>
      <Titulo />
      <div className="max-w-md mx-auto my-12 p-10 bg-white rounded-3xl shadow-2xl border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Criar Conta de Responsável</h1>
        <p className="text-center text-gray-500 mb-8 leading-relaxed">
          Apenas pais/responsáveis podem criar contas. Crianças acessam com token.
        </p>
        
        <form onSubmit={handleSubmit(cadastrarUsuario)} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo:</label>
            <input 
              type="text" 
              required
              className="w-full p-4 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 transition-all" 
              {...register("nome")}
              placeholder="Seu nome completo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email:</label>
            <input 
              type="email" 
              required
              className="w-full p-4 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 transition-all" 
              {...register("email")}
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Senha:</label>
            <input 
              type="password" 
              required
              className="w-full p-4 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 transition-all"
              {...register("senha")} 
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          
          <div className="flex flex-col gap-3 pt-4">
            <input 
              type="submit" 
              value="Criar Conta de Responsável" 
              className="w-full py-4 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-bold rounded-xl cursor-pointer shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all" 
            />
            <a 
              href="/login" 
              className="w-full py-4 text-center bg-gray-500 text-white font-bold rounded-xl hover:bg-gray-600 hover:-translate-y-1 transition-all"
            >
              Já tenho conta
            </a>
          </div>
        </form>
      </div>
    </>
  )
}

export default Registro