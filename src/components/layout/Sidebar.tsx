'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FlaskConical,
  Boxes,
  MapPin,
  Wheat,
  Container,
  ClipboardList,
  Users,
  ShoppingCart,
  TrendingUp,
  Package,
} from 'lucide-react';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Production',
    icon: FlaskConical,
    items: [
      { title: 'Recipes', href: '/dashboard/recipes', icon: FlaskConical },
      { title: 'Batches', href: '/dashboard/batches', icon: Boxes },
      { title: 'Tanks', href: '/dashboard/tanks', icon: Container },
    ],
  },
  {
    title: 'Inventory',
    icon: Package,
    items: [
      { title: 'Ingredients', href: '/dashboard/ingredients', icon: Wheat },
      { title: 'Suppliers', href: '/dashboard/suppliers', icon: Users },
      { title: 'Purchase Orders', href: '/dashboard/purchase-orders', icon: ShoppingCart },
      { title: 'Stock Movements', href: '/dashboard/stock-movements', icon: TrendingUp },
    ],
  },
  {
    title: 'Settings',
    icon: ClipboardList,
    items: [
      { title: 'Locations', href: '/dashboard/locations', icon: MapPin },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-card border-r">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/dashboard">
          <h1 className="text-2xl font-bold">Brewery PMS</h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          if (item.items) {
            return (
              <div key={item.title} className="space-y-1">
                <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-muted-foreground">
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </div>
                <div className="space-y-1 ml-4">
                  {item.items.map((subItem) => {
                    const isActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <subItem.icon className="h-4 w-4" />
                        {subItem.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t text-xs text-muted-foreground">
        © 2025 Brewery PMS
      </div>
    </div>
  );
}
