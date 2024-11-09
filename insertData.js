import fs from 'fs';
import { MongoClient, ObjectId } from 'mongodb';

// Load the JSON data from the file (data skipped for brevity)
const jsonData = [
  {
    "collection": "Billboards",
    "documents": [
      {
        "_id": "30bfb709-5b66-4e65-856a-85eccc7a420a",
        "storeId": "7f8c027c-97f1-4fb7-9291-9235dfaeafee",
        "label": "اشحنها",
        "imageUrl": "https://res.cloudinary.com/dtcr7vypb/image/upload/v1726841904/eza1zruvuic4y6tvl9nq.jpg",
        "createdAt": {"$date": "2024-09-20T14:18:36.382Z"},
        "updatedAt": {"$date": "2024-09-20T14:18:36.382Z"}
      },
      {
        "_id": "327d6b5b-b9ae-4b1c-9858-2ff1bdf56dcc",
        "storeId": "7f8c027c-97f1-4fb7-9291-9235dfaeafee",
        "label": "اشحنها ابيض العاب التسلية",
        "imageUrl": "https://res.cloudinary.com/dtcr7vypb/image/upload/v1726841943/ikutk1s8iwbcoylrob5i.jpg",
        "createdAt": {"$date": "2024-09-20T14:19:20.627Z"},
        "updatedAt": {"$date": "2024-09-20T14:19:20.627Z"}
      },
      {
        "_id": "60675700-eb19-46c6-aaa1-6125898404b5",
        "storeId": "7f8c027c-97f1-4fb7-9291-9235dfaeafee",
        "label": "برامج لايف ابيض",
        "imageUrl": "https://res.cloudinary.com/dtcr7vypb/image/upload/v1726842074/vpnxro34iljd8bgjxy4r.jpg",
        "createdAt": {"$date": "2024-09-20T14:21:23.977Z"},
        "updatedAt": {"$date": "2024-09-20T14:21:23.977Z"}
      },
      {
        "_id": "c85f6bfd-c93d-46e5-9f24-f99308b179b9",
        "storeId": "7f8c027c-97f1-4fb7-9291-9235dfaeafee",
        "label": "اشحنها ابيض",
        "imageUrl": "https://res.cloudinary.com/dtcr7vypb/image/upload/v1726842150/l51uordzy5yer6opmjay.jpg",
        "createdAt": {"$date": "2024-09-20T14:22:43.187Z"},
        "updatedAt": {"$date": "2024-09-20T14:22:43.187Z"}
      },
      {
        "_id": "e10b2378-2985-449c-ae0e-9ba2563f1da4",
        "storeId": "bb56c8d1-440d-4daa-9af0-fd5e8344c5de",
        "label": "انجوي جيمز",
        "imageUrl": "https://res.cloudinary.com/dtcr7vypb/image/upload/v1726763814/k44am41x58epxsn4w56f.jpg",
        "createdAt": {"$date": "2024-09-19T16:37:43.146Z"},
        "updatedAt": {"$date": "2024-09-19T16:37:43.146Z"}
      },
      {
        "_id": "eacae123-ca92-44d0-8cb8-e517fe3149d8",
        "storeId": "7f8c027c-97f1-4fb7-9291-9235dfaeafee",
        "label": "برامج لايف",
        "imageUrl": "https://res.cloudinary.com/dtcr7vypb/image/upload/v1726772363/lwrwmrmk55wb5imuizhb.jpg",
        "createdAt": {"$date": "2024-09-19T18:59:48.932Z"},
        "updatedAt": {"$date": "2024-09-20T14:18:08.649Z"}
      }
    ]
  },
  {
    "collection": "Categories",
    "documents": [
      {
        "_id": "02af60f7-c3bb-4bec-87a9-90e10ab90427",
        "storeId": "7f8c027c-97f1-4fb7-9291-9235dfaeafee",
        "billboardId": "eacae123-ca92-44d0-8cb8-e517fe3149d8",
        "name": "عملات تيك توك Tiktok",
        "createdAt": {"$date": "2024-09-19T19:11:11.508Z"},
        "updatedAt": {"$date": "2024-09-19T19:11:11.508Z"}
      },
      {
        "_id": "80837aae-851f-451d-8472-be5167a76a8e",
        "storeId": "bb56c8d1-440d-4daa-9af0-fd5e8344c5de",
        "billboardId": "e10b2378-2985-449c-ae0e-9ba2563f1da4",
        "name": "تيك توك",
        "createdAt": {"$date": "2024-09-19T16:38:54.145Z"},
        "updatedAt": {"$date": "2024-09-19T16:38:54.145Z"}
      }
    ]
  },
  {
    "collection": "products",
    "documents": [
      {
        "_id": "0dacbefe-3658-4d01-b3f0-004afc6b9a6c",
        "storeId": "7f8c027c-97f1-4fb7-9291-9235dfaeafee",
        "categoryId": "02af60f7-c3bb-4bec-87a9-90e10ab90427",
        "name": "شحن عملات تيك توك 3500",
        "price": 2241.57,
        "isFeatured": true,
        "isArchived": false,
        "createdAt": {"$date": "2024-09-19T19:36:39.049Z"},
        "updatedAt": {"$date": "2024-09-19T19:36:39.049Z"},
        "images": [
          {
            "url": "https://res.cloudinary.com/dtcr7vypb/image/upload/v1726774534/rddm66nsenv3nqsxfgl7.jpg"
          }
        ]
      },
      {
        "_id": "10c46750-bfdf-4b5e-ab60-8c9d8f1f9f02",
        "storeId": "bb56c8d1-440d-4daa-9af0-fd5e8344c5de",
        "categoryId": "80837aae-851f-451d-8472-be5167a76a8e",
        "name": "7000 تيك توك",
        "price": 100,
        "isFeatured": true,
        "isArchived": false,
        "createdAt": {"$date": "2024-09-19T16:39:33.894Z"},
        "updatedAt": {"$date": "2024-09-19T16:39:33.894Z"},
        "images": [
          {
            "url": "https://res.cloudinary.com/dtcr7vypb/image/upload/v1726763951/r8yqocw8u95bbvn4m1ze.jpg"
          }
        ]
      },
      {
        "_id": "2811e470-f15e-44b1-8eb9-66e0ddad852d",
        "storeId": "7f8c027c-97f1-4fb7-9291-9235dfaeafee",
        "categoryId": "02af60f7-c3bb-4bec-87a9-90e10ab90427",
        "name": "شحن عملات تيك توك مخصص",
        "price": 1,
        "isFeatured": false,
        "isArchived": true,
        "createdAt": {"$date": "2024-09-19T19:37:43.570Z"},
        "updatedAt": {"$date": "2024-09-19T19:37:43.570Z"},
        "images": [
          {
            "url": "https://res.cloudinary.com/dtcr7vypb/image/upload/v1726774613/nz7bfaogsuidjfyzo0v7.jpg"
          }
        ]
      },
      {
        "_id": "43f7d4ef-e3dd-4088-b23f-21320401e87b",
        "storeId": "7f8c027c-97f1-4fb7-9291-9235dfaeafee",
        "categoryId": "02af60f7-c3bb-4bec-87a9-90e10ab90427",
        "name": "شحن عملات تيك توك 70,000",
        "price": 42117.72,
        "isFeatured": true,
        "isArchived": false,
        "createdAt": {"$date": "2024-09-19T19:35:16.202Z"},
        "updatedAt": {"$date": "2024-09-19T19:35:16.202Z"},
        "images": [
          {
            "url": "https://res.cloudinary.com/dtcr7vypb/image/upload/v1726774465/dsdbvjidgzzw8smvyjpq.jpg"
          }
        ]
      },
      {
        "_id": "c89a4922-3956-478f-8421-835ea1d21e9b",
        "storeId": "7f8c027c-97f1-4fb7-9291-9235dfaeafee",
        "categoryId": "02af60f7-c3bb-4bec-87a9-90e10ab90427",
        "name": "شحن عملات تيك توك 17500",
        "price": 10529.23,
        "isFeatured": true,
        "isArchived": false,
        "createdAt": {"$date": "2024-09-19T19:39:21.836Z"},
        "updatedAt": {"$date": "2024-09-19T19:39:21.836Z"},
        "images": [
          {
            "url": "https://res.cloudinary.com/dtcr7vypb/image/upload/v1726774680/gbjvjsna8tmzova0bxea.jpg"
          }
        ]
      }
    ]
  },
  {
    "collection": "Stores",
    "documents": [
      {
        "_id": "7f8c027c-97f1-4fb7-9291-9235dfaeafee",
        "name": "Engoy Games",
        "userId": "user_2mIY16AMwAIP7y8qnqLynRRDFYt",
        "createdAt": {"$date": "2024-09-19T17:05:45.979Z"},
        "updatedAt": {"$date": "2024-09-19T17:05:45.979Z"}
      }
    ]
  }
]; // Assuming jsonData will be defined or loaded elsewhere

async function run() {
  const uri = 'mongodb+srv://EngoyGames:EngoyGames@cluster0.hpwsy.mongodb.net/EngoyGames?retryWrites=true&w=majority&appName=Cluster0';
  const client = new MongoClient(uri);

  try {
    await client.connect();

    for (const collectionData of jsonData) {
      const collectionName = collectionData.collection;
      const documents = collectionData.documents;

      const collection = client.db("EngoyGames").collection(collectionName);

      // Insert documents with validation for _id
      const validDocuments = documents.map(doc => {
        if (typeof doc._id === 'string' && doc._id.length === 24) {
          return {
            ...doc,
            _id: new ObjectId(doc._id), // Convert string IDs to ObjectId
          };
        } else {
          console.warn(`Invalid _id format for document: ${JSON.stringify(doc)}`);
          return null; // Skip invalid documents
        }
      }).filter(doc => doc !== null); // Remove invalid documents

      if (validDocuments.length > 0) {
        await collection.insertMany(validDocuments);
      } else {
        console.warn(`No valid documents to insert for collection: ${collectionName}`);
      }
    }

    console.log("Data inserted successfully!");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    await client.close();
  }
}

run().catch(console.error);


run().catch(console.error);
