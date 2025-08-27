import { useQuery } from "@tanstack/react-query";
import { collection, query, orderBy, limit, getDocs, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateSlug, Item } from "@/constants";

const fetchNewArrivals = async (): Promise<Item[]> => {
  const q = query(
    collection(db, "candles"),
    orderBy("createdAt", "desc"),
    limit(10)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      price: data.price,
      imageUrl: data.imageUrl,
      inStock: data.inStock,
      description: data.description,
      slug: generateSlug(data.name),
      createdAt: data.createdAt.toDate(), // Firestore Timestamp → Date
    } as Item;
  });
};

export const useNewArrivals = () => {
  return useQuery<Item[]>({
    queryKey: ["newArrivals"],
    queryFn: fetchNewArrivals,
  });
};