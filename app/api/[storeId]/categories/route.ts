import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

// POST handler for creating a new category
export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth(); // Get the authenticated user's ID
    const body = await req.json(); // Parse the request body
    const { name, billboardId, categoryDescription, fields, categoryType } = body; // Include categoryType

    // Validate the request data
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Missing name', { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse('Missing billboardId', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Missing storeId', { status: 400 });
    }

    if (!categoryType) {
      return new NextResponse('Missing categoryType', { status: 400 }); // Validate categoryType
    }

    // Validate fields (if provided)
    if (fields && !Array.isArray(fields)) {
      return new NextResponse('Fields must be an array', { status: 400 });
    }

    if (fields) {
      for (const field of fields) {
        if (!field.fieldName || !field.fieldType) {
          return new NextResponse('Each field must have a fieldName and fieldType', { status: 400 });
        }
      }
    }

    // Check if the store belongs to the user
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Create a new category including the fields and categoryType
    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        categoryDescription,
        categoryType, // Include categoryType in the creation
        storeId: params.storeId,
        fields: {
          create: fields, // Use create to add fields
        },
      },
    });

    return new NextResponse(JSON.stringify(category), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[CATEGORIES_POST]', error); // Log error for debugging

    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// GET handler for fetching categories
export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) {
      return new NextResponse('Missing storeId', { status: 400 });
    }

    // Fetch categories including their fields
    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
      include: {
        fields: true, // Include the fields relation
      },
    });

    return new NextResponse(JSON.stringify(categories), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[CATEGORIES_GET]', error); // Log error for debugging

    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
