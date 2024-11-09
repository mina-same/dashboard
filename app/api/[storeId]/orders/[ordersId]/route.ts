// File: api/[storeId]/orders/[orderId]/route.ts

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function PUT(req: Request, { params }: { params: { storeId: string; orderId: string } }) {
  try {
    const { userId } = auth();
    console.log('Authenticated User ID:', userId);

    const { status } = await req.json();
    console.log('Payload status:', status); // Log status payload

    if (!userId) return new NextResponse('Unauthorized', { status: 401 });
    if (!status) return new NextResponse('Missing status', { status: 400 });
    if (!params.orderId) return new NextResponse('Missing orderId', { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    console.log('Store found:', storeByUserId); // Log store check

    if (!storeByUserId) return new NextResponse('Unauthorized', { status: 401 });

    const order = await prismadb.order.update({
      where: { id: params.orderId },
      data: { status },
    });

    return new NextResponse(JSON.stringify(order), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[ORDER_UPDATE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
