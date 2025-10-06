import { useQuery } from "@tanstack/react-query";
import { collection, query, orderBy, limit, getDocs, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateSlug, Item } from "@/constants";

const fetchLatestItems = async (limitCount = 10): Promise<Item[]> => {
  const collections = ["candles", "diffusers", "homewares"]; // add more if needed
  const allItems: Item[] = [];

  for (const col of collections) {
    const q = query(
      collection(db, col),
      orderBy("createdAt", "desc"),
      limit(limitCount) // fetch a few from each collection
    );

    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        price: data.price,
        imageUrl: data.imageUrl,
        inStock: data.inStock,
        description: data.description,
        slug: generateSlug(data.name),
        createdAt: data.createdAt.toDate(),
        type: col, // optional: track collection type
      } as Item;
    });

    allItems.push(...items);
  }

  // Sort all items by createdAt descending and take the top `limitCount`
  return allItems
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limitCount);
};

export const useNewArrivals = () => {
  return useQuery<Item[]>({
    queryKey: ["latestItems"],
    queryFn: () => fetchLatestItems(10),
  });
};