import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import prismadb from '@/lib/prismadb';
import { stripe } from '@/lib/stripe';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
    };
  },
) {
  const { productIds, orderFields } = await req.json(); // Expecting orderFields in the request body

  if (!productIds) {
    return new NextResponse("Missing 'productIds' in request body", {
      status: 400,
    });
  }

  if (!orderFields || !Array.isArray(orderFields) || orderFields.length === 0) {
    return new NextResponse("Missing or invalid 'orderFields' in request body", {
      status: 400,
    });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'USD',
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100,
      },
    });
  });

  // Create the order with order fields
  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
          // Create OrderFields for each productId based on the corresponding input
          OrderField: {
            create: orderFields.map((field) => ({
              fieldValue: field.fieldValue, // Assuming field has fieldValue
              field: {
                connect: {
                  id: field.fieldId, // Assuming field has fieldId to connect
                },
              },
            })),
          },
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    billing_address_collection: 'required',
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    },
  );
}
