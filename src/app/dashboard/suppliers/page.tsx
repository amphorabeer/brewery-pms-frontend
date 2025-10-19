'use client';

import { useSuppliers, useSupplierStats } from '@/hooks/useSuppliers';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Users, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SuppliersPage() {
  const { data: suppliers, isLoading: suppliersLoading } = useSuppliers();
  const { data: stats, isLoading: statsLoading } = useSupplierStats();

  if (suppliersLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-gray-600">
            Manage your ingredient and material suppliers
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/suppliers/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.active || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats?.inactive || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suppliers List */}
      <Card>
        <CardHeader>
          <CardTitle>Suppliers List</CardTitle>
        </CardHeader>
        <CardContent>
          {suppliers && suppliers.length > 0 ? (
            <div className="space-y-4">
              {suppliers.map((supplier: any) => (
                <div
                  key={supplier.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-lg">{supplier.name}</p>
                    <p className="text-sm text-gray-600">
                      {supplier.city && supplier.country
                        ? `${supplier.city}, ${supplier.country}`
                        : supplier.city || supplier.country || 'No location'}
                    </p>
                    {supplier.contactPerson && (
                      <p className="text-xs text-gray-500 mt-1">
                        Contact: {supplier.contactPerson}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        supplier.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {supplier.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/suppliers/${supplier.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No suppliers found.</p>
              <p className="text-sm mt-2">
                Click "Add Supplier" to create your first supplier.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
