import { ReactNode } from 'react';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import Navbar from '@/components/navbar'; // Assuming you have a Navbar component

export default async function NotAdminLayout({ children }: { children: ReactNode }) {
  const { userId } = auth(); // Get the authenticated user ID

  // If there is no user, redirect to the sign-in page
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div>
      {children}
    </div>
  );
}
