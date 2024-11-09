import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

import prismadb from '@/lib/prismadb'

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { label, imageUrl, isBillboardActive } = body // Added isBillboardActive

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!label) {
      return new NextResponse('Missing label', { status: 400 })
    }

    if (!imageUrl) {
      return new NextResponse('Missing imageUrl', { status: 400 })
    }

    if (!params.storeId) {
      return new NextResponse('Missing storeId', { status: 400 })
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        isBillboardActive: isBillboardActive || false, // Default to false if not provided
        storeId: params.storeId,
      },
    })

    return new NextResponse(JSON.stringify(billboard), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.log('[BILLBOARDS_POST]', error)

    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    if (!params.storeId) {
      return new NextResponse('Missing storeId', { status: 400 })
    }

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
        isBillboardActive: true, // Optional: Only fetch active billboards
      },
    })

    return new NextResponse(JSON.stringify(billboards), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.log('[BILLBOARDS_GET]', error)

    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
