import prismadb from "@/lib/prismadb";

import { ProductForm } from "./components/product-form";

const ProductPage = async ({
  params,
}: {
  params: {
    productId: string;
    storeId: string;
  };
}) => {
  let product = null;

  // Check if we are creating a new product
  if (params.productId !== "new") {
    product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
      },
    });
  }

  // Fetch categories for the store
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product} // Pass the product data or null
          categories={categories}
        />
      </div>
    </div>
  );
};

export default ProductPage;
