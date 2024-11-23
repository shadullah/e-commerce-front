"use client";
import { addToCart } from "@/store/Reducers/cartSlice";
import { useAppSelector } from "@/store/store";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";

const myLoader = ({ src }: { src: string }) => {
  return src;
};

interface CartProduct {
  productId: {
    _id: string;
    name: string;
    price: number;
    productImage: string;
  };
  quantity: number;
  _id: string;
}

interface Cart {
  _id: string;
  customer: string;
  cartItems: CartProduct[];
}

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}

const Cart = () => {
  const [carts, setCarts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          toast.error("Login to get you cartItems");
          return;
        }

        const id = localStorage.getItem("id");
        if (!id) {
          toast.error("User id not found");
        }

        const res = await axios.get<ApiResponse<Cart>>(
          `/api/v1/carts/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const cartData = res?.data?.data?.cartItems || "";
        const cartId = res?.data?.data?._id;
        setCartId(cartId);
        console.log(cartData);
        setCarts(cartData);
      } catch (err) {
        toast.error("Failed to fetch cart items", { duration: 3000 });
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const Subtotal = useMemo(() => {
    return carts.reduce(
      (ttl, Item) => ttl + Item.productId.price * Item.quantity,
      0
    );
  }, [carts]);

  const handlePlus = (id: string) => {
    setCarts((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleMinus = (id: string) => {
    setCarts((pre) =>
      pre.map((item) =>
        item._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const ttl = Subtotal;

  // const productId = carts.find(item=>)

  const handleCartUpdate = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("user not authenticated");
        return;
      }

      await carts.map((item) => {
        console.log(item);
        axios.patch(
          `/api/v1/carts/${cartId}`,
          {
            productId: item.productId._id,
            quantity: item?.quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
      });
      router.push(`/orders`);
      toast.success("Cart updated success");
    } catch (err) {
      console.log(err);
      toast.error("error in update", { duration: 3000 });
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const id = localStorage.getItem("id");
      if (!id) {
        toast.error("User id not found");
      }
      // const productId = carts.find(item=>item.productId)
      // console.log(productId);
      axios.delete(`/api/v1/carts/user/${id}/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setCarts((prevItems) =>
        prevItems.filter((item) => item.productId._id !== productId)
      );
      toast.success("deleted successfully!!");
    } catch (error) {
      toast.error("Couldn't Delete the item");
      console.log(error);
    }
  };

  const [isLoggedIn, setIsLoggedin] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("accessToken");
    if (user) {
      setIsLoggedin(true);
    }
  }, []);

  return (
    <div>
      <div className="main block md:flex justify-between mx-0 md:mx-12">
        <div className="w-full p-6 ">
          <h1 className="text-xl md:text-2xl font-medium my-4">
            Overview of your order
          </h1>
          <div className="">
            {carts?.length > 0 ? (
              <>
                {carts.map((item) => (
                  <div
                    key={item?._id}
                    className="grid grid-cols-1 md:grid-cols-4 items-center text-center gap-6 bg-gray-800 p-3 m-3 rounded-md"
                  >
                    <div className="flex justify-center items-center">
                      <Image
                        loader={myLoader}
                        className="w-16 rounded-md mr-2"
                        src={item.productId.productImage}
                        alt="#"
                        height={2}
                        width={2}
                        unoptimized
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
                        <span className="text-lg">{item.quantity}</span>
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
                        onClick={() => handleDelete(item.productId._id)}
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
        <div className="w-full md:w-1/4 p-6">
          <h1 className="text-xl md:text-2xl font-medium my-4">
            Order Details
          </h1>
          <div className="p-3 bg-gray-300 rounded-md space-y-2 text-gray-600">
            <div className="text-sm flex justify-between">
              <p>Subtotal: </p>
              <p>${Subtotal.toFixed(2)}</p>
            </div>
            <div className="text-sm flex justify-between">
              <p className="">Shipping: </p>

              <p>Free</p>
            </div>
            <hr />
            <div className="text-lg font-medium flex justify-between">
              <p className="">Total:</p>

              <p>${ttl.toFixed(2)}</p>
            </div>
          </div>
          {isLoggedIn ? (
            <>
              <div>
                <button
                  onClick={handleCartUpdate}
                  className="bg-gray-800 w-full text-gray-100 py-2 rounded-md my-3"
                >
                  GO TO CHECKOUT &rarr;
                </button>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
