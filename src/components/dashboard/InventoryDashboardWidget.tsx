'use client';

import { useInventoryStats, useLowStockAlerts } from '@/hooks/useInventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Users,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function InventoryDashboardWidget() {
  const { data: stats, isLoading: statsLoading } = useInventoryStats();
  const { data: lowStock, isLoading: lowStockLoading } = useLowStockAlerts();

  if (statsLoading || lowStockLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Suppliers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSuppliers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 font-medium">
                {stats?.activeSuppliers || 0} active
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Purchase Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Purchase Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPurchaseOrders || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-yellow-600 font-medium">
                {stats?.pendingOrders || 0} pending
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Stock Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₾{(stats?.totalStockValue || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total inventory value</p>
          </CardContent>
        </Card>

        {/* Low Stock Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats?.lowStockItems || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Items need reordering</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {lowStock && lowStock.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Low Stock Alerts</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Items that need to be reordered
                </p>
              </div>
              <Link href="/dashboard/stock-movements">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStock.slice(0, 5).map((item) => (
                <div
                  key={item.ingredientId}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{item.ingredientName}</div>
                      <div className="text-sm text-muted-foreground">
                        Current: {item.currentStock} {item.unit}
                        {item.minStock && ` • Min: ${item.minStock}`}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      item.status === 'CRITICAL' ? 'destructive' : 'secondary'
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Suppliers */}
      {stats?.topSuppliers && stats.topSuppliers.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Suppliers</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  By order count and value
                </p>
              </div>
              <Link href="/dashboard/suppliers">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topSuppliers.slice(0, 5).map((item) => (
                <div
                  key={item.supplier.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{item.supplier.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.orderCount} orders
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₾{item.totalValue.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">Total value</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Last {stats?.recentMovements || 0} stock movements
              </p>
            </div>
            <Link href="/dashboard/stock-movements">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <TrendingUp className="h-8 w-8 mr-2" />
            <p>Stock movements tracked</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}