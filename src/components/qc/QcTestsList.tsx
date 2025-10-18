'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useQcTests, useDeleteQcTest } from '@/hooks/useQc';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { QcTestResult } from '@/types';

interface QcTestsListProps {
  batchId: string;
}

export function QcTestsList({ batchId }: QcTestsListProps) {
  const { data: tests = [], isLoading } = useQcTests(batchId);
  const deleteMutation = useDeleteQcTest();

  const handleDelete = async (testId: string) => {
    if (!confirm('Are you sure you want to delete this QC test?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(testId);
      toast.success('QC test deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete QC test');
    }
  };

  const getResultIcon = (result: QcTestResult) => {
    switch (result) {
      case 'PASS':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'FAIL':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  const getResultBadge = (result: QcTestResult) => {
    const styles = {
      PASS: 'bg-green-100 text-green-800',
      FAIL: 'bg-red-100 text-red-800',
      PENDING: 'bg-amber-100 text-amber-800',
    };

    return (
      <Badge className={styles[result]}>
        {getResultIcon(result)}
        <span className="ml-1">{result}</span>
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Loading QC tests...</p>
        </CardContent>
      </Card>
    );
  }

  if (tests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quality Control Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No QC tests recorded yet.</p>
            <p className="text-sm mt-2">Add your first test above!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Control Tests ({tests.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Tested By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((test) => (
              <TableRow key={test.id}>
                <TableCell className="font-medium">
                  {test.testType?.name || 'Unknown'}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{test.testType?.category}</Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(test.testedAt), 'MMM dd, yyyy HH:mm')}
                </TableCell>
                <TableCell>{getResultBadge(test.result)}</TableCell>
                <TableCell>
                  {test.value !== null && test.value !== undefined ? (
                    <span>
                      {test.value} {test.testType?.unit || ''}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {test.notes || <span className="text-muted-foreground">-</span>}
                </TableCell>
                <TableCell className="text-sm">
                  {test.user
                    ? `${test.user.firstName} ${test.user.lastName}`
                    : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(test.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
