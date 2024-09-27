"use client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";

const myLoader = ({ src }: { src: string }) => {
  return src;
};

interface CartItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    discount: number;
    price: number;
    productImage: string;
  };
  quantity: number;
  customer: string;
  name: string;
}

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          toast.error("User not authenticated");
          return;
        }

        const id = localStorage.getItem("id");
        if (!id) {
          toast.error("User id not found");
        }

        const res = await axios.get<ApiResponse<CartItem[]>>(
          `http://localhost:8000/api/v1/carts/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res.data?.data);
        setCartItems(res.data?.data);
      } catch (err) {
        toast.error("Failed to fetch cart items", { duration: 3000 });
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handlePlus = (id: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleMinus = (id: string) => {
    setCartItems((pre) =>
      pre.map((item) =>
        item._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  return (
    <div>
      <div className="main flex justify-between mx-12">
        <div className="w-full p-6 ">
          <h1 className="text-2xl font-medium my-4">Overview of your order</h1>
          <div className="">
            {cartItems.length > 0 ? (
              <>
                {cartItems.map((item) => (
                  <div
                    key={item?._id}
                    className="grid grid-cols-4 items-center gap-6 bg-gray-800 p-3 rounded-md"
                  >
                    <div className="flex justify-center items-center">
                      <Image
                        loader={myLoader}
                        className="w-16 rounded-md mr-2"
                        src={item.productId.productImage}
                        alt="#"
                        height={2}
                        width={2}
                      />
                      <h5>{item.productId.name}</h5>
                    </div>
                    <div>
                      {" "}
                      <p className="mt-3 space-x-2">
                        <span
                          onClick={() => handleMinus(item._id)}
                          className="text-sm font-extrabold bg-gray-400 px-2 py-1 rounded-md cursor-pointer"
                        >
                          -
                        </span>
                        <span className="text-xl">{item.quantity}</span>
                        <span
                          onClick={() => handlePlus(item._id)}
                          className="text-sm font-extrabold bg-gray-400 px-2 py-1 rounded-md cursor-pointer"
                        >
                          +
                        </span>
                      </p>
                    </div>

                    <div>price: ${item.productId.price}</div>
                    <div>
                      <button
                        className="bg-gray-400 p-3 rounded-full"
                        // onClick={() => removeItem(item.id)}
                      >
                        <IoMdClose />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <p>Cart is empty now</p>
              </>
            )}
          </div>
        </div>
        <div className="w-1/4 p-6">
          <h1 className="text-2xl font-medium my-4">Order Details</h1>
          <div className="p-3 bg-gray-300 rounded-md space-y-2 text-gray-600">
            <div className="text-sm flex justify-between">
              <p>Subtotal: </p>
              {/* <p>${Subtotal.toFixed(2)}</p> */}
            </div>
            <div className="text-sm flex justify-between">
              <p className="">Shipping: </p>

              <p>Free</p>
            </div>
            <hr />
            <div className="text-lg font-medium flex justify-between">
              <p className="">Total:</p>

              {/* <p>${total.toFixed(2)}</p> */}
            </div>
          </div>
          <div>
            <button className="bg-gray-800 w-full text-gray-100 py-2 rounded-md my-3">
              GO TO CHECKOUT &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
