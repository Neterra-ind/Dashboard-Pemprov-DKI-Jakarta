import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useRole } from '@/lib/role'
import {
  Building2,
  ClipboardCheck,
  LayoutDashboard,
  MapPin,
  Newspaper,
  ShieldAlert,
  UserRound,
} from 'lucide-react'
import type { Role } from '@/types'
import logoNeterra from '@/assets/logo-neterra.png'
import logoDkiJakarta from '@/assets/logo-dki-jakarta.png'

const NAV_ITEMS: { to: string; label: string; icon: typeof LayoutDashboard; end?: boolean; roles: Role[] }[] = [
  { to: '/', label: 'Executive Summary', icon: LayoutDashboard, end: true, roles: ['Eksekutif', 'Admin OPD', 'Super Admin'] },
  { to: '/isu-provinsi', label: 'Isu Provinsi DKI Jakarta', icon: MapPin, roles: ['Eksekutif', 'Super Admin'] },
  { to: '/isu-pimpinan', label: 'Isu Gubernur & Wakil Gubernur', icon: UserRound, roles: ['Eksekutif', 'Super Admin'] },
  { to: '/pemberitaan-opd', label: 'Pemberitaan OPD', icon: Building2, roles: ['Eksekutif', 'Super Admin'] },
  { to: '/early-warning', label: 'Issues Negatif', icon: ShieldAlert, roles: ['Eksekutif', 'Super Admin'] },
  { to: '/tindak-lanjut', label: 'Tindak Lanjut', icon: ClipboardCheck, roles: ['Admin OPD', 'Super Admin'] },
  { to: '/data-sumber', label: 'Data Sumber', icon: Newspaper, roles: ['Eksekutif', 'Super Admin'] },
]

function BrandMark() {
  return (
    <div className="mb-8 flex items-center gap-3 px-2 md:mb-8">
      <img src={logoDkiJakarta} alt="Logo DKI Jakarta" className="h-10 w-10 shrink-0 object-contain" />
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Issues Monitoring Dashboard
        </p>
        <p className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">PEMPROV DKI JAKARTA</p>
      </div>
    </div>
  )
}

function PoweredByNeterra() {
  return (
    <div className="flex items-center justify-center gap-2 px-2 py-2">
      <span className="text-xs text-slate-400 dark:text-slate-500">Powered by</span>
      <img src={logoNeterra} alt="Neterra Indonesia" className="h-14 w-auto self-start rounded object-contain" />
    </div>
  )
}

export function AppLayout() {
  const { role } = useRole()
  const navUntukRole = NAV_ITEMS.filter((item) => item.roles.includes(role))

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 md:flex-row">
      <header className="border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 md:hidden">
        <div className="mb-3 flex items-center gap-2">
          <img src={logoDkiJakarta} alt="Logo DKI Jakarta" className="h-8 w-8 shrink-0 object-contain" />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Issues Monitoring Dashboard
            </p>
            <p className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">PEMPROV DKI JAKARTA</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto">
          {navUntukRole.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-brand-blue/10 text-brand-blue dark:bg-brand-gold/10 dark:text-brand-gold'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                )
              }
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 dark:border-slate-800 dark:bg-slate-900 md:flex">
        <BrandMark />
        <nav className="space-y-1">
          {navUntukRole.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-blue/10 text-brand-blue dark:bg-brand-gold/10 dark:text-brand-gold'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-6">
          <PoweredByNeterra />
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="md:hidden">
            <PoweredByNeterra />
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
