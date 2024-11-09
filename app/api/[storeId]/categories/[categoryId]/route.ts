import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

// GET endpoint to fetch a category along with its fields
export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } },
) {
  try {
    if (!params.categoryId) {
      return new NextResponse('Missing categoryId', { status: 400 });
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
        fields: true, // This includes the related fields
      },
    });

    if (!category) {
      return new NextResponse('Category not found', { status: 404 });
    }

    return new NextResponse(JSON.stringify(category), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[CATEGORY_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PATCH endpoint to update a category
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } },
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, billboardId, categoryDescription, fields, categoryType } = body; // Include categoryType

    // Authorization check
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Required fields check
    if (!name || !billboardId || !params.categoryId) {
      return new NextResponse('Missing required fields', { status: 400 });
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

    const categoryExists = await prismadb.category.findUnique({
      where: { id: params.categoryId },
    });

    if (!categoryExists) {
      return new NextResponse('Category not found', { status: 404 });
    }

    // Log fields before the upsert
    console.log('Fields being updated:', fields);

    // Update the category with fields and categoryType
    const updatedCategory = await prismadb.category.update({
      where: { id: params.categoryId },
      data: {
        name,
        billboardId,
        categoryDescription,
        categoryType, // Update categoryType
        fields: {
          upsert: fields
            .filter((field: { id: any; }) => field.id) // Filter out fields with an empty id
            .map((field: { id: any; fieldName: any; fieldType: any; options: any; OrderField: any; }) => ({
              where: { id: field.id }, // Upsert requires an id for existing fields
              update: {
                fieldName: field.fieldName,
                fieldType: field.fieldType,
                options: field.options,
                OrderField: field.OrderField ? field.OrderField : undefined,
              },
              create: {
                fieldName: field.fieldName,
                fieldType: field.fieldType,
                options: field.options,
                OrderField: field.OrderField ? field.OrderField : undefined,
              },
            })),
        },
      },
    });

    return new NextResponse(JSON.stringify(updatedCategory), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[CATEGORY_PATCH]', error);
    console.error('Error details:', (error as any).response?.data);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE endpoint to remove a category
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!params.categoryId) {
      return new NextResponse('Missing categoryId', { status: 400 });
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

    const categoryExists = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
    });

    if (!categoryExists) {
      return new NextResponse('Category not found', { status: 404 });
    }

    // Step 1: Delete or update fields associated with this category
    await prismadb.field.deleteMany({
      where: {
        categoryId: params.categoryId, // Adjust the query to match your relation
      },
    });

    // Step 2: Delete the category itself
    const deletedCategory = await prismadb.category.delete({
      where: {
        id: params.categoryId,
      },
    });

    return new NextResponse(JSON.stringify(deletedCategory), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[CATEGORY_DELETE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
