"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { BackgroundGradient } from "../../../components/ui/background-gradient";
import Image from "next/image";
import Link from "next/link";
import { Audio } from "react-loader-spinner";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  productImage: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discount: number;
  stock: boolean;
}

interface ApiResponse {
  statusCode: number;
  data: { totalProducts: number; products: Product[] };
  message: string;
}

const myLoader = ({ src }: { src: string }) => {
  return src;
};

const CategoryFeaturedProducts = ({ params }: any) => {
  const { id } = params;
  const [products, setProducts] = useState<Product[]>([]);
  //   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `/api/v1/products?category=${id}`;
        const res = await axios.get<ApiResponse>(url);
        const fetchedProducts = res.data?.data?.products || [];

        setProducts(fetchedProducts);

        setTotalPages(Math.ceil(setProducts.length / 10));
      } catch (err) {
        console.log(err);
        setProducts([]);
        toast.error("Category wise Product fetch error");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id]);

  const truncate = (str: string, len: number) => {
    if (str.length <= len) return str;
    return str.slice(0, len) + "...";
  };

  return (
    <div className="my-6 py-12 bg-gray-900">
      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center">
            <Audio
              height="80"
              width="80"
              //   radius="9"
              color="gray"
              ariaLabel="loading"
            />
          </div>
        ) : (
          <>
            {products?.length === 0 ? (
              <div className="text-3xl bg-red-600 text-center py-2 my-24 w-full md:w-1/2 mx-auto rounded-lg">
                <p>No Products Found or server error</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-8 justify-center m-2 md:m-12">
                  {products?.map((product: Product) => (
                    <div className="flex justify-center" key={product?._id}>
                      <BackgroundGradient className="flex flex-col rounded-[22px] bg-white dark:bg-zinc-900 overflow-hidden h-full max-w-sm">
                        <div className="p-6">
                          <Image
                            loader={myLoader}
                            src={product.productImage}
                            alt="productImage"
                            height="400"
                            width="400"
                            unoptimized
                            className="object-contain rounded-2xl mb-2"
                          />
                          <p className="text-xl font-bold text-center mb-2">
                            {truncate(product.name, 12)}
                          </p>
                          <div className="flex justify-between items-center space-x-4">
                            <p className="my-3">৳ {product.price}</p>
                            <Link
                              href={`/products/${product._id}`}
                              className="bg-slate-700 px-3 py-2 rounded-2xl text-sm"
                            >
                              <button>Details</button>
                            </Link>
                          </div>
                        </div>
                      </BackgroundGradient>
                    </div>
                  ))}
                </div>
                {/* pagination start here */}{" "}
                <div className="flex justify-center items-center my-4 space-x-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className="bg-pink-400 px-2 py-2 rounded-md"
                  >
                    &larr; Prev
                  </button>
                  <span className="font-bold text-md"></span>
                  Page {currentPage} of {totalPages}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className="bg-pink-400 px-2 py-2 rounded-md"
                  >
                    {" "}
                    Next &rarr;
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryFeaturedProducts;
