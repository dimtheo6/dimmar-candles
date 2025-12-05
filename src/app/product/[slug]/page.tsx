"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Item } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import Loading from "./loading";
import "@splidejs/react-splide/css";
import { useCartStore } from "@/store/cartStore";

function extractIdFromSlug(slug: string): string {
  const parts = slug.split("-");
  return parts[parts.length - 1] || "";
}

async function fetchProduct(id: string): Promise<Item> {
  const collections = ["candles", "diffusers", "homewares"];

  // Try to find the product in each collection
  for (const collectionName of collections) {
    const docRef = doc(db, collectionName, id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      return {
        id: snapshot.id,
        name: data.name,
        price: data.price,
        imageUrl: data.imageUrl,
        inStock: data.inStock,
        description: data.description,
        type: data.type || collectionName, // Use type field or fallback to collection name
        slug: data.slug || "", // Add slug field
        createdAt: data.createdAt?.toDate(),
        ...data, // Include any additional fields
      } as Item;
    }
  }

  throw new Error("Product not found");
}

function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const productId = extractIdFromSlug(slug);

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const handleAddToCart = (item: Item) => {
    if (item) {
      addItem(item);
      openCart();
    }
  };

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId,
    staleTime: 60_000,
  });

  if (!productId) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">Invalid Product URL</h1>
        <Link href="/" className="text-pink-600 underline mt-4 inline-block">
          Return to Home
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 text-center">
        <p className="text-2xl font-bold text-red-600">
          {(error as Error).message}
        </p>
        <Link href="/" className="text-pink-600 underline mt-4 inline-block">
          Return to Home
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">Product Not Found</h1>
        <Link href="/" className="text-pink-600 underline mt-4 inline-block">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Link href="/" className="hover:text-neutral-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/${product.type}`}
            className="hover:text-neutral-600 transition-colors capitalize"
          >
            {product.type}
          </Link>
          <span>/</span>
          <span className="text-neutral-600">{product.name}</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid sm:grid-cols-2 gap-16 max-sm:gap-8">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square  rounded-2xl overflow-hidden items-center justify-center flex">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl[0]}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover max-sm:w-3/4 max-sm:h-3/4 max-sm:mx-auto "
                  priority
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <div className="text-center text-neutral-300">
                    <div className="text-6xl mb-4">🕯️</div>
                    <p className="text-sm">No Image Available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Product Title & Description */}
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-neutral-900">
                {product.name}
              </h1>

              {product.description && (
                <p className="text-lg text-neutral-600 leading-relaxed max-w-lg">
                  {product.description}
                </p>
              )}
            </div>

            {/* Price */}
            {typeof product.price === "number" && (
              <div className="text-3xl font-light text-neutral-900">
                ${product.price.toFixed(2)}
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  product.inStock ? "bg-green-400" : "bg-red-400"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  product.inStock ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Add to Cart  */}
            <div className="pt-4">
              <button
                disabled={!product.inStock}
                className={`w-full max-w-sm py-4 px-8 rounded-full font-medium text-sm tracking-wide transition-all duration-200 ${
                  product.inStock
                    ? "bg-neutral-900 text-white hover:bg-neutral-800 active:scale-95 cursor-pointer"
                    : "bg-neutral-50 text-neutral-500 border-2 border-neutral-200 cursor-not-allowed relative overflow-hidden"
                }`}
                onClick={() => handleAddToCart(product)}
              >
                {product.inStock ? (
                  "Add to Cart"
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Out of Stock
                  </span>
                )}
              </button>
            </div>

            {/* Product Details */}
            <div className="pt-8 border-t border-neutral-100">
              <h3 className="text-lg font-medium text-neutral-900 mb-6">
                Details
              </h3>
              <dl className="space-y-4">
                <div className="flex justify-between items-center">
                  <dt className="text-sm text-neutral-500">Category</dt>
                  <dd className="text-sm font-medium text-neutral-900 capitalize">
                    {product.type || product.category || "Candles"}
                  </dd>
                </div>

                {product.weight && (
                  <div className="flex justify-between items-center">
                    <dt className="text-sm text-neutral-500">Weight</dt>
                    <dd className="text-sm font-medium text-neutral-900">
                      {product.weight}
                    </dd>
                  </div>
                )}

                {product.burnTime && (
                  <div className="flex justify-between items-center">
                    <dt className="text-sm text-neutral-500">Burn Time</dt>
                    <dd className="text-sm font-medium text-neutral-900">
                      {product.burnTime}
                    </dd>
                  </div>
                )}

                {product.scent && (
                  <div className="flex justify-between items-center">
                    <dt className="text-sm text-neutral-500">Scent</dt>
                    <dd className="text-sm font-medium text-neutral-900">
                      {product.scent}
                    </dd>
                  </div>
                )}

                {product.material && (
                  <div className="flex justify-between items-center">
                    <dt className="text-sm text-neutral-500">Material</dt>
                    <dd className="text-sm font-medium text-neutral-900">
                      {product.material}
                    </dd>
                  </div>
                )}

                {product.dimensions && (
                  <div className="flex justify-between items-center">
                    <dt className="text-sm text-neutral-500">Dimensions</dt>
                    <dd className="text-sm font-medium text-neutral-900">
                      {product.dimensions}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        {(product.careInstructions || product.ingredients) && (
          <div className="mt-24 pt-16 border-t border-neutral-100">
            <div className="grid md:grid-cols-2 gap-16">
              {product.careInstructions && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-neutral-900">
                    Care Instructions
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {product.careInstructions}
                  </p>
                </div>
              )}

              {product.ingredients && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-neutral-900">
                    Ingredients
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {product.ingredients}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default ProductPage;
