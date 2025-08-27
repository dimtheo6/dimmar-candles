"use client";

import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Item } from "@/constants";

interface UseCategoryItemsOptions {
  category: string;
}

export function useCategoryItems({ category }: UseCategoryItemsOptions) {
  return useQuery({
    queryKey: ["categoryItems", category],
    queryFn: async () => {
      try {
        // Use the category name as the collection name (like useNewArrivals does)
        const itemsRef = collection(db, category.toLowerCase());

        // Simple query without category filter since collection name IS the category
        const snapshot = await getDocs(itemsRef);

        const items: Item[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "",
            price: data.price || 0,
            inStock: data.inStock !== false,
            imageUrl: data.imageUrl || [],
            description: data.description || "",
            slug: data.slug || "",
            createdAt: data.createdAt?.toDate() || new Date(),
            category: data.category || "",
            weight: data.weight || "",
            burnTime: data.burnTime || "",
            scent: data.scent || "",
            material: data.material || "",
            dimensions: data.dimensions || "",
            careInstructions: data.careInstructions || "",
            ingredients: data.ingredients || "",
          };
        });

        return items;
      } catch (error) {
        console.error("Error fetching category items:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}
