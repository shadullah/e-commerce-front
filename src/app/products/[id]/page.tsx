"use client";
import useCarts from "@/hooks/useCarts";
import { addToCart } from "@/store/Reducers/cartSlice";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Audio } from "react-loader-spinner";
import { useDispatch } from "react-redux";

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
  category: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  thumbnail: string;
}

interface ApiResponse {
  statusCode: number;
  data: Product;
  message: string;
}

const ProductDetails = ({ params }: any) => {
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [cat, setCat] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [carts] = useCarts();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get<ApiResponse>(`/api/v1/products/${id}`);
        console.log(res.data);
        setProduct(res.data?.data);
      } catch (err) {
        console.log(err);
        toast.error("Details could not fetched", { duration: 3000 });
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  console.log(product?._id);

  const cursorControl = product?.stock;
  const discount = product ? product?.discount : 0;
  const originalPrice = product ? product.price / (1 - discount / 100) : 0;

  useEffect(() => {
    const getCategory = async () => {
      if (product?.category) {
        try {
          const res = await axios.get(
            `/api/v1/category/all/${product.category}`
          );
          setCat(res.data?.data);
        } catch (error) {
          console.log(error);
          toast.error("Category could not fetched");
        }
      }
    };
    getCategory();
  }, [product?.category]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      const token = localStorage.getItem("accessToken"); // Get the user's access token
      if (!token) {
        toast.error("User not authenticated");
        return;
      }

      const userId = localStorage.getItem("id");
      if (!userId) {
        toast.error("Failed to fetch userId");
        return;
      }

      await axios.post(
        "/api/v1/carts/create",
        {
          productId: product._id,
          quantity: 1,
          customer: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product added to cart!");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response && error.response.status === 400) {
          toast.error("Product is already in the cart");
        } else {
          toast.error("Failed to add product to cart");
        }
      } else {
        toast.error("An unexpected error occured");
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl md:text-5xl font-bold mt-12 md:mt-16 mb-6 md:mb-12 text-center">
        Details page
      </h1>
      <div>
        <div className="block md:flex justify-center items-center mx-3 md:mx-12">
          {loading ? (
            <div>
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
              <div className="w-full md:w-1/2 p-2 md:p-6">
                {product?.productImage && (
                  <Image
                    loader={myLoader}
                    src={product.productImage}
                    alt="img"
                    height={600}
                    width={600}
                    unoptimized
                    className="object-contain rounded-2xl "
                    priority
                  />
                )}
              </div>
              <div className="w-full md:w-1/2 p-2 md:p-6">
                <h1 className="text-lg md:text-2xl font-extrabold my-3">
                  {product?.name}
                </h1>
                <p className="text-md">{product?.description}</p>
                <div className="flex items-center space-x-2 my-3">
                  {cat?.thumbnail && (
                    <Image
                      loader={myLoader}
                      src={cat?.thumbnail}
                      alt="img"
                      unoptimized
                      height={50}
                      width={50}
                    />
                  )}
                  <p className="text-sm">Category: {cat?.name}</p>
                </div>
                <p>
                  Stock:{" "}
                  {product?.stock ? (
                    <span className="text-green-400">Available</span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </p>
                <div className="block md:flex items-center space-y-2 md:space-x-6">
                  <h3 className="text-orange-600 text-3xl font-bold my-3">
                    ৳ {product?.price}
                  </h3>
                  <p className="line-through text-gray-500">
                    ৳ {originalPrice.toFixed(2)}
                  </p>
                  <div className="bg-pink-400 px-2 py-1 text-center rounded-full">
                    <span>{product?.discount} % OFF</span>
                  </div>
                </div>
                <button
                  className={`bg-gray-900 w-full font-bold py-2 rounded-lg my-3 ${
                    cursorControl ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                  disabled={!cursorControl}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
