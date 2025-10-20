'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-[#252525] flex items-center justify-center px-6"
    >
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Plateforme LMS
          </h1>
          <p className="text-neutral-400 text-lg">
            Choisissez votre rôle pour vous connecter
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admin */}
          <Link href="/login/admin">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass p-8 rounded-2xl hover:shadow-elev-3 transition-all duration-300 group cursor-pointer"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-iris-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-iris-500/30 transition-colors">
                  <svg className="w-8 h-8 text-iris-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-white mb-3">Admin</h2>
                <p className="text-neutral-400 mb-4">
                  Gestion complète de la plateforme
                </p>
                <div className="text-sm text-neutral-500">
                  Email + Mot de passe ou Google OAuth
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Formateur */}
          <Link href="/login/formateur">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass p-8 rounded-2xl hover:shadow-elev-3 transition-all duration-300 group cursor-pointer"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blush-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blush-500/30 transition-colors">
                  <svg className="w-8 h-8 text-blush-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-white mb-3">Formateur</h2>
                <p className="text-neutral-400 mb-4">
                  Création et gestion des formations
                </p>
                <div className="text-sm text-neutral-500">
                  Email + Mot de passe
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Tuteur */}
          <Link href="/login/tuteur">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass p-8 rounded-2xl hover:shadow-elev-3 transition-all duration-300 group cursor-pointer"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-lime-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-lime-500/30 transition-colors">
                  <svg className="w-8 h-8 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-white mb-3">Tuteur</h2>
                <p className="text-neutral-400 mb-4">
                  Suivi et accompagnement des apprenants
                </p>
                <div className="text-sm text-neutral-500">
                  Lien magique par email
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Apprenant */}
          <Link href="/login/apprenant">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass p-8 rounded-2xl hover:shadow-elev-3 transition-all duration-300 group cursor-pointer"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-cyan-500/30 transition-colors">
                  <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-white mb-3">Apprenant</h2>
                <p className="text-neutral-400 mb-4">
                  Accès aux formations et cours
                </p>
                <div className="text-sm text-neutral-500">
                  Lien magique par email
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}