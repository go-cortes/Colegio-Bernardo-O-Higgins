import React from 'react';
import { ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroBanner: React.FC = () => {
  return (
    <header className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-slate-800/80"></div>
      </div>

      {/* Main Content Container */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-800/50 border border-blue-400/30 text-blue-100 text-sm font-medium backdrop-blur-sm mb-8">
            <ShieldCheck size={16} className="text-blue-300" />
            Plataforma Oficial 2026
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mb-6 drop-shadow-md" style={{ animationDelay: '0.3s', opacity: 0 }}>
          Gestión Académica Inteligente y Centralizada
        </h1>

        {/* Sub-headline */}
        <p className="animate-fade-in-up text-lg sm:text-xl text-blue-100 max-w-2xl mb-12 drop-shadow leading-relaxed" style={{ animationDelay: '0.5s', opacity: 0 }}>
          Modernizando la educación en el <strong className="text-white font-semibold">Colegio Bernardo O'Higgins</strong>. Una herramienta diseñada para facilitar la comunicación y el acceso rápido a la información académica de nuestros estudiantes.
        </p>

        {/* Call to Action Buttons */}
        <div className="animate-fade-in-up flex flex-col sm:flex-row gap-4 items-center justify-center w-full" style={{ animationDelay: '0.7s', opacity: 0 }}>
          
          <Link 
            to="/login"
            className="group w-full sm:w-auto flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/30 hover:scale-105"
          >
            <BookOpen size={20} className="group-hover:text-amber-300 transition-colors" />
            Iniciar Sesión
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <a 
            href="#soporte"
            className="w-full sm:w-auto flex justify-center items-center px-8 py-4 rounded-lg font-semibold text-lg text-white border border-white/30 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
          >
            Conocer más
          </a>
          
        </div>
        
      </section>
    </header>
  );
};
