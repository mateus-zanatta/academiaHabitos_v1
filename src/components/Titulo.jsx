import { Link } from 'react-router-dom'

export default function Titulo({ usuario, onLogout }) {
  return (
    <>
      <header className="sticky top-0 z-50 shadow-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white">
  {/* Container Principal */}
  <div className="container mx-auto px-4 py-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
    
    {/* LOGO */}
    <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
      <div className="text-4xl md:text-5xl animate-bounce">
        🎯
      </div>
      <div className="flex flex-col">
        <h1 className="text-xl md:text-2xl font-bold leading-tight">
          Academia de Hábitos
        </h1>
        <span className="text-sm font-light opacity-90">
          Transformando rotinas em aventuras
        </span>
      </div>
    </div>

    {/* NAVEGAÇÃO */}
    <nav className="flex flex-wrap justify-center items-center gap-2 md:gap-6 w-full md:w-auto">
      
      <Link to="/" className="px-6 py-3 rounded-full font-semibold border-2 border-transparent transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5">
        Home
      </Link>

      {!usuario ? (
        <>
          <Link to="/login" className="px-6 py-3 rounded-full font-semibold border-2 border-transparent transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5">
            Login
          </Link>
          <Link to="/registro" className="px-6 py-3 rounded-full font-semibold border-2 border-white/40 bg-white/20 transition-all duration-300 hover:bg-white/30 hover:-translate-y-0.5">
            Cadastrar
          </Link>
        </>
      ) : (
        <>
          <Link to="/selecao-perfil" className="px-6 py-3 rounded-full font-semibold border-2 border-transparent transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5">
            Meu App
          </Link>
          
          {/* Menu do Usuário */}
          <div className="flex items-center gap-3 bg-white/15 px-4 py-2 rounded-full backdrop-blur-md">
            <span className="text-sm font-medium hidden md:block">
              Olá, {usuario.nome}
            </span>
            
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">
              {usuario.avatar || (usuario.tipo === 'pai' ? '👨' : '👦')}
            </div>
            
            <button 
              onClick={onLogout} 
              className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center border-none cursor-pointer transition-all duration-300 hover:bg-white/30 hover:scale-110" 
              title="Sair"
            >
              🚪
            </button>
          </div>
        </>
      )}
    </nav>
  </div>
</header>
    </>
  )
}