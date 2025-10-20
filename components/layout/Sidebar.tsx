'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Layers, Folder, FileCheck, Users, Settings } from 'lucide-react';

function NavItem({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={[
        'mx-3 mt-1 flex items-center gap-3 rounded-xl px-3 py-2 transition',
        active
          ? 'bg-white/10 border border-white/10 shadow-elev-2'
          : 'hover:bg-white/5'
      ].join(' ')}
    >
      <Icon size={18} className={active ? 'text-white' : 'text-neutral-300'} />
      <span className="text-sm">{label}</span>
    </Link>
  );
}

export default function Sidebar({ role }: { role: 'admin' | 'instructor' | 'tutor' | 'learner' }) {
  return (
    <div className="py-4">
      <div className="px-4 pb-4">
        <div className="text-lg font-semibold text-iris-grad">LMS Admin</div>
        <div className="text-xs opacity-70">Espace {role}</div>
      </div>

      <nav className="space-y-1">
        <NavItem href="/admin" icon={LayoutDashboard} label="Dashboard" />
        <NavItem href="/admin/formations" icon={BookOpen} label="Formations" />
        <NavItem href="/admin/ressources" icon={Folder} label="Ressources" />
        <NavItem href="/admin/tests" icon={FileCheck} label="Tests" />
        <NavItem href="/admin/parcours" icon={Layers} label="Parcours" />
        <NavItem href="/admin/utilisateurs" icon={Users} label="Utilisateurs" />
        <NavItem href="/admin/settings" icon={Settings} label="Paramètres" />
      </nav>
    </div>
  );
}