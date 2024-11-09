import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  // Fetch categories with related billboard and fields
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true, // Include billboard details
      fields: true, // Ensure fields are included
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Map the fetched categories to the CategoryColumn type
  const formattedCategories: CategoryColumn[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    categoryDescription: category.categoryDescription,
    billboardLabel: category.billboard?.label || "N/A", // Fallback in case of missing billboard
    createdAt: format(category.createdAt, "MMMM do, yyyy"),
    categoryType: category.categoryType, // Include the categoryType
    fields: category.fields.map((field) => ({
      fieldName: field.fieldName,
      fieldType: field.fieldType,
      options: field.options || [], // Ensure options are an array
    })),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
