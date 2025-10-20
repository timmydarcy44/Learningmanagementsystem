'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-[#252525] flex items-center justify-center px-6"
    >
      <div className="w-full max-w-md text-center">
        <div className="glass p-8 rounded-2xl">
          <div className="w-16 h-16 bg-neutral-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-semibold text-white mb-4">
            Page non trouvée
          </h1>
          
          <p className="text-neutral-400 mb-6">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          
          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full bg-iris-500 hover:bg-iris-400 text-white py-3 rounded-xl font-medium transition-all duration-300"
            >
              Retour à la connexion
            </Link>
            
            <Link
              href="/"
              className="block w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-medium border border-white/10 transition-all duration-300"
            >
              Page d'accueil
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
