import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

// --- GET PRODUCT ---
export async function GET(req: Request, { params }: { params: { productId: string } }) {
  try {
    const { productId } = params;

    if (productId === "new") {
      return new NextResponse(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!productId) {
      return new NextResponse("Missing productId", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
        category: true,
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// --- PATCH PRODUCT ---
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { storeId, productId } = params;
    const body = await req.json();
    const { name, price, categoryId, images, isFeatured, isArchived, productDescription } = body;

    if (!name || !price || !categoryId || !images || !images.length) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: storeId, userId },
    });

    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 401 });

    // Update product details
    await prismadb.product.update({
      where: { id: productId },
      data: {
        name,
        price,
        categoryId,
        isFeatured,
        isArchived,
        productDescription,
        images: { deleteMany: {} }, // Clear previous images
      },
    });

    const product = await prismadb.product.update({
      where: { id: productId },
      data: {
        images: {
          createMany: { data: images.map((image: { url: string }) => image) },
        },
      },
    });

    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// --- DELETE PRODUCT ---
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { storeId, productId } = params;

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: storeId, userId },
    });

    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 401 });

    const relatedOrderItems = await prismadb.orderItem.findMany({
      where: { productId },
    });

    if (relatedOrderItems.length > 0) {
      return new NextResponse("Cannot delete product with associated order items", {
        status: 400,
      });
    }

    const product = await prismadb.product.delete({
      where: { id: productId },
    });

    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
