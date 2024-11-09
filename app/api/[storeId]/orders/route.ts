import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

import prismadb from '@/lib/prismadb'

// Assuming the order status you want to update will be sent in the request body
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; orderId: string } },
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { status } = body; // Expecting the new status in the request body

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!status) {
      return new NextResponse('Missing status', { status: 400 });
    }

    if (!params.orderId) {
      return new NextResponse('Missing orderId', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const order = await prismadb.order.update({
      where: {
        id: params.orderId, // Make sure you pass the correct order ID
      },
      data: {
        status, // Update the status of the order
      },
    });

    return new NextResponse(JSON.stringify(order), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.log('[ORDER_PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
