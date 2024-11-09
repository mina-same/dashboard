import { ObjectId } from 'bson'; // Import ObjectId to validate categoryId

import prismadb from '@/lib/prismadb';

import { CategoryForm } from './components/category-form';

const CategoryPage = async ({
  params,
}: {
  params: {
    categoryId: string;
    storeId: string;
  };
}) => {
  // Check if categoryId is "new" or a valid ObjectId
  const isNewCategory = params.categoryId === 'new';
  const categoryId = ObjectId.isValid(params.categoryId) ? params.categoryId : null;

  let category = null;

  if (!isNewCategory && categoryId) {
    // Only fetch the category if it's not "new" and the ID is valid
    category = await prismadb.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        fields: true, // Include fields associated with the category
      },
    });
  }

  // Fetch billboards regardless of whether it's a new category
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  );
}

export default CategoryPage;
