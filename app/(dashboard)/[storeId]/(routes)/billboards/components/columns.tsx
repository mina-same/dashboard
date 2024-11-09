'use client'

import { ColumnDef } from '@tanstack/react-table'

import { CellAction } from './cell-action'

export type BillboardColumn = {
  id: string
  label: string
  createdAt: string
  isBillboardActive: boolean // Add the new field here
}

// Updated columns definition to reflect the new data structure
export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: 'label',
    header: 'Label',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
  },
  {
    accessorKey: 'isBillboardActive', // Adding isBillboardActive to the columns
    header: 'Active', // You can change this to a more descriptive title if needed
    cell: ({ row }) => (row.getValue('isBillboardActive') ? 'Yes' : 'No'), // Display Yes/No based on the boolean value
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
