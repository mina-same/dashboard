import { ObjectId } from 'bson'; // Import ObjectId

import prismadb from '@/lib/prismadb';

import { BillboardForm } from './components/billboard-form';

const BillboardPage = async ({
  params,
}: {
  params: {
    billboardId: string;
  };
}) => {
  // Convert billboardId to an ObjectId if valid, or set it to null
  let billboardId: ObjectId | null = null;

  if (ObjectId.isValid(params.billboardId) && params.billboardId !== "new") {
    billboardId = new ObjectId(params.billboardId);
  }

  // If the billboardId is invalid and not for a new record
  if (!billboardId && params.billboardId !== "new") {
    return (
      <div className="p-8">
        <h1>Invalid Billboard ID</h1>
        <p>The provided Billboard ID is not valid. Please check the URL and try again.</p>
      </div>
    );
  }

  // Fetch billboard only if it's not for a new entry
  const billboard = billboardId
    ? await prismadb.billboard.findUnique({
        where: {
          id: billboardId,
        },
      })
    : null;

  // Check if the billboard exists (only for existing records)
  if (billboardId && !billboard) {
    return (
      <div className="p-8">
        <h1>Billboard Not Found</h1>
        <p>The requested billboard does not exist. Please check the ID and try again.</p>
      </div>
    );
  }

  // Render the form with initial data for editing or a blank form for new entries
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
