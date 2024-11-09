'use client';

import { ColumnDef } from '@tanstack/react-table';

import { StatusCell } from './StatusCell'; // Import StatusCell component

export type OrderColumn = {
  storeId: string;
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
  status: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  { accessorKey: 'products', header: 'Products' },
  { accessorKey: 'phone', header: 'Phone' },
  { accessorKey: 'address', header: 'Address' },
  { accessorKey: 'totalPrice', header: 'Total Price' },
  {
    accessorKey: 'isPaid',
    header: 'Paid',
    cell: ({ row }) => (row.getValue('isPaid') ? 'Yes' : 'No'),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <StatusCell
        initialStatus={row.getValue('status')}
        storeId={row.original.storeId}
        orderId={row.original.id} // Use row.original to access 'id'
      />
    ),
  },
  { accessorKey: 'createdAt', header: 'Created At' },
];
