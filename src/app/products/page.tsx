"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { BackgroundGradient } from "../../components/ui/background-gradient";
import Image from "next/image";
import Link from "next/link";
import { Audio } from "react-loader-spinner";
import { usePathname, useRouter } from "next/navigation";
import { BiSearchAlt2 } from "react-icons/bi";

interface Product {
  _id: string;
  productImage: string;
  name: string;
  description: string;
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

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQ, setSearchQ] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = searchQ
          ? `http://localhost:8000/api/v1/products?search=${searchQ}`
          : `http://localhost:8000/api/v1/products?page=${currentPage}`;
        const res = await axios.get<ApiResponse>(url);
        console.log(res?.data.data);
        const fetchedProducts = res.data.data.products || [];
        setTotalPages(Math.ceil(res.data.data.totalProducts / 10));
        setProducts(fetchedProducts);
      } catch (err) {
        console.log(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQ, currentPage]);

  const truncate = (str: string, len: number) => {
    if (str.length <= len) return str;
    return str.slice(0, len) + "...";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setLoading(true);
  };
  const pathname = usePathname();

  const homepage = pathname === "/";

  return (
    <div className="my-6 py-12 bg-gray-900">
      <div></div>

      {homepage ? (
        <>
          <div className="md:flex justify-between items-center px-3 md:px-24">
            <div className="">
              <h2 className="text-base text-violet-400 font-semibold tracking-wide uppercase">
                Featured Products
              </h2>
              <p className="mt-2 text-lg md:text-3xl leading-8 font-extrabold tracking-tight text-white">
                {" "}
                Get Best products here
              </p>
            </div>
            <div className="">
              <Link href="/products">
                <button className="text-sm md:text-lg">See More &rarr;</button>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <div className="text-center my-2 md:my-6">
              <h1 className="text-violet-400 text-2xl md:text-4xl font-bold mb-2">
                All Products
              </h1>
              <p className="text-sm md:text-normal">
                Explore all the products of Lazz Pharma
              </p>
            </div>
            <div className="flex justify-center items-center">
              <form onSubmit={handleSearch} className="">
                <div className="flex justify-center items-center rounded-lg my-2 md:my-6">
                  <input
                    type="text"
                    className="bg-gray-800 rounded-tl-2xl rounded-bl-2xl outline-none w-1/2 md:w-full px-3 md:px-24 py-2 md:py-4"
                    placeholder="Search Here..."
                    name="search"
                    onChange={(e) => setSearchQ(e.target.value)}
                    value={searchQ}
                  />
                  <button
                    type="submit"
                    className="text-xl md:text-3xl text-gray-200 bg-gray-950 rounded-tr-2xl rounded-br-2xl px-2 md:px-3 py-2 md:py-3"
                  >
                    <BiSearchAlt2 className="" />
                  </button>
                </div>
              </form>
            </div>
            <div className="block md:flex md:space-x-4 space-y-2 items-center px-4 md:px-16">
              <h1 className="text-xl">Filters: </h1>
              <div>
                <button className="px-3 py-2 bg-slate-500 rounded-lg">
                  Price <span>&uarr;</span>
                </button>
              </div>
              <div className="flex space-x-3">
                <div>
                  In Stock <input type="checkbox" />
                </div>
                <div>
                  Stock out <input type="checkbox" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

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
            {searchQ && products?.length === 0 ? (
              <div className="text-3xl bg-red-600 text-center py-2 my-24 w-full md:w-1/2 mx-auto rounded-lg">
                <p>No Products Found or server error</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-8 justify-center m-2 md:m-12">
                  {homepage ? (
                    <>
                      {products?.slice(0, 4).map((product: Product) => (
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
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
                {homepage ? (
                  <></>
                ) : (
                  <>
                    {" "}
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
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
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
          </>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;
