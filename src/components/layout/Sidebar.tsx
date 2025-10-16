'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: '📊 Dashboard', icon: '📊' },
  { href: '/batches', label: '🍺 Batches', icon: '🍺' },
  { href: '/recipes', label: '📖 Recipes', icon: '📖' },
  { href: '/analytics', label: '📈 Analytics', icon: '📈' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold">🍺 Brewery PMS</h1>
        <p className="text-sm text-gray-600 mt-1">Production Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? 'bg-amber-50 text-amber-900 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label.replace(/^.+ /, '')}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-900">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-gray-600">{user?.email}</p>
          <p className="text-xs text-gray-500 mt-1">
            Role: <span className="font-medium">{user?.role}</span>
          </p>
        </div>
        <Button
          onClick={logout}
          variant="outline"
          className="w-full"
          size="sm"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}