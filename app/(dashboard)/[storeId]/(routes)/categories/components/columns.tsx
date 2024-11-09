'use client';

import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';

// Updated CategoryColumn type to include categoryType
export type CategoryColumn = {
  id: string;
  name: string;
  categoryDescription: string;
  billboardLabel: string;
  createdAt: string;
  categoryType: string; // Add categoryType here
  fields: { fieldName: string; fieldType: string; options: string[] }[]; // Fields property
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'billboard',
    header: 'Billboard',
    cell: ({ row }) => row.original.billboardLabel,
  },
  {
    accessorKey: 'categoryDescription',
    header: 'Category Description',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
  },
  {
    accessorKey: 'categoryType', // Add categoryType to display in the table
    header: 'Category Type',
  },
  {
    id: 'fields',
    header: 'Fields',
    cell: ({ row }) => (
      <ul>
        {row.original.fields.map((field, index) => (
          <li key={index}>
            {field.fieldName} 
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
