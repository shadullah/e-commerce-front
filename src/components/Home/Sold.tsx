"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Audio } from "react-loader-spinner";
import { BackgroundGradient } from "../ui/background-gradient";
import Flicking from "@egjs/react-flicking";
import "@egjs/react-flicking/dist/flicking.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const myLoader = ({ src }: { src: string }) => {
  return src;
};

interface Product {
  _id: string;
  productImage: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  stock: boolean;
  top_sold: boolean;
}

interface ApiResponse {
  statusCode: number;
  data: { products: Product[] };
  message: string;
}

const Sold = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const flickingRef = useRef<Flicking | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<ApiResponse>("/api/v1/products");
        // console.log(res?.data);
        setProducts(res?.data?.data.products);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const truncate = (str: string, len: number) => {
    if (str.length <= len) return str;
    return str.slice(0, len) + "...";
  };

  const handlePrev = () => {
    if (!isAnimating && flickingRef.current) {
      const flicking = flickingRef.current;
      if (flicking.index > 0) {
        // Check to avoid moving beyond first item
        setIsAnimating(true);
        flicking.prev(300).finally(() => setIsAnimating(false));
      }
    }
  };

  const handleNext = () => {
    if (!isAnimating && flickingRef.current) {
      const flicking = flickingRef.current;
      if (flicking.index < flicking.panelCount - 1) {
        // Check to avoid moving beyond last item
        setIsAnimating(true);
        flicking.next(300).finally(() => setIsAnimating(false));
      }
    }
  };

  return (
    <div className="py-6 bg-gray-900 my-4">
      <div>
        <div className="block md:flex justify-between items-center px-3 md:px-12">
          <p className=" text-xl leading-8 font-bold tracking-tight text-white sm:text-2xl">
            {" "}
            Best Selling
          </p>
          <Link href="/products">
            <button className="text-sm md:text-lg">See More &rarr;</button>
          </Link>
        </div>
      </div>
      <div className="mt-10">
        {/* TODO: Add carousel for product showing */}

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
                <div className="px-3 md:px-20">
                  <Flicking
                    ref={flickingRef}
                    moveType="freeScroll"
                    bound={true}
                    className="w-full"
                  >
                    {products
                      ?.filter((product: Product) => product?.top_sold === true)
                      .map((product: Product) => (
                        <div className="m-3 w-48 md:w-64" key={product?._id}>
                          <BackgroundGradient className="flex flex-col rounded-[22px] bg-white dark:bg-zinc-900 overflow-hidden h-full max-w-sm">
                            <div className="p-2 md:p-6">
                              <Image
                                loader={myLoader}
                                src={product.productImage}
                                alt="productImage"
                                height="400"
                                width="400"
                                unoptimized
                                className="object-contain  rounded-2xl mb-2"
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
                  </Flicking>

                  <div className="flex justify-end space-x-3 py-6">
                    <button
                      onClick={handlePrev}
                      className="bg-gray-700 p-3 rounded-full"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={handleNext}
                      className="bg-gray-700 p-3 rounded-full"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Sold;
