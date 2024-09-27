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
  data: Product[];
  message: string;
}

const myLoader = ({ src }: { src: string }) => {
  return src;
};

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = searchQ
          ? `http://localhost:8000/api/v1/products?search=${searchQ}`
          : `http://localhost:8000/api/v1/products`;
        const res = await axios.get<ApiResponse>(url);
        console.log(res?.data);
        setProducts(res?.data?.data || []);
      } catch (err) {
        console.log(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQ]);

  const truncate = (str: string, len: number) => {
    if (str.length <= len) return str;
    return str.slice(0, len) + "...";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  };
  const pathname = usePathname();

  const urlCheck = pathname === "/";

  return (
    <div className="py-12 bg-gray-900">
      <div>
        <div className="text-center">
          <h2 className="text-base text-pink-600 font-semibold tracking-wide uppercase">
            Featured Products
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            {" "}
            Get Best products here
          </p>
        </div>
      </div>

      {urlCheck ? (
        <></>
      ) : (
        <>
          <div className="flex justify-between items-center px-24">
            <div>
              <span className="text-3xl text-center">Products</span>
            </div>
            <div>
              <form onSubmit={handleSearch} className="">
                <div className="flex items-center px-6 py-3 rounded-lg mt-6">
                  <input
                    type="text"
                    className="bg-gray-800 border-b-2 p-[2.5px] outline-none w-full"
                    placeholder="Search Here..."
                    name="search"
                    onChange={(e) => setSearchQ(e.target.value)}
                    value={searchQ}
                  />
                  <button type="submit" className="">
                    <BiSearchAlt2 className="text-3xl border-b-2 p-1 " />
                  </button>
                </div>
              </form>
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 justify-center m-12">
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
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;
