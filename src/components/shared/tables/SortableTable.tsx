import React, { useState } from 'react';
import clsx from 'clsx';
import { ChevronUp, ChevronDown } from 'lucide-react';
import DataTable, { Column } from './DataTable';

interface SortableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

function SortableTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading,
  emptyMessage,
  onRowClick,
  className,
}: SortableTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortColumn === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  const sortableColumns: Column<T>[] = columns.map((column) => ({
    ...column,
    header: (
      <div
        className={clsx(
          'flex items-center gap-1',
          column.sortable && 'cursor-pointer hover:text-gray-700'
        )}
        onClick={() => column.sortable && handleSort(column.key)}
      >
        {typeof column.header === 'string' ? column.header : column.key}
        {column.sortable && sortColumn === column.key && (
          sortDirection === 'asc' ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )
        )}
      </div>
    ),
  }));

  return (
    <DataTable
      data={sortedData}
      columns={sortableColumns}
      loading={loading}
      emptyMessage={emptyMessage}
      onRowClick={onRowClick}
      className={className}
    />
  );
}

export default SortableTable;
