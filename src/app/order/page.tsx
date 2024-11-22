"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/cn";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, Suspense, useState, useMemo } from "react";
import Cart from "../cart/page";
import toast from "react-hot-toast";
import Image from "next/image";

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

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}

const OrderPage = () => {
  const [carts, setCarts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState("");
  const [user, setUser] = useState();
  const search = useSearchParams();

  const token = localStorage.getItem("accessToken");

  // cart fetch here
  useEffect(() => {
    const fetchCart = async () => {
      try {
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
  console.log(Subtotal);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `/api/v1/users/${localStorage.getItem("id")}`
      );
      setUser(res.data?.data?._id);
      console.log(res.data);
    };
    fetchUser();
  }, []);

  const handleOrderAndPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("clicked");

    const formData = new FormData(e.currentTarget);
    const orderDetails = {
      customer: user,
      orderPrice: parseFloat(Subtotal.toString()),
      status: "PENDING",
      orderItems: cartId,
      address: formData.get("address"),
      city: formData.get("city"),
      district: formData.get("district"),
      phone: parseInt(formData.get("phone") as string),
      zip: parseInt(formData.get("zip") as string),
    };
    console.log(orderDetails);
    try {
      const orderResponse = await axios.post(
        `/api/v1/orders/create`,
        orderDetails,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("order success");
      console.log(orderResponse);
      const data = orderResponse?.data?.data;
      const orderId = data._id;
      if (orderId) {
        const paymentResponse = await axios.post(
          "/api/v1/payments/create-payment",
          {
            customer: data.customer,
            orderId,
            orderPrice: data.orderPrice,
          }
        );

        console.log(paymentResponse);

        const redirectUrl = paymentResponse.data.paymentUrl;

        if (redirectUrl) {
          window.location.replace(redirectUrl);
        }
      }
    } catch (error) {
      console.log("Error creating order or Payment", error);
    }

    // const numeric = parseFloat(ttl);

    // if (isNaN(numeric)) {
    //   console.error("invalid amount value");
    //   return;
    // }

    // axios
    //   .post("/api/v1/payments/create-payment", {
    //     customer: myId,
    //     orderPrice: numeric,
    //     currency: "BDT",
    //   })
    //   .then((res) => {
    //     console.log(res);
    //     const redirectUrl = res.data.paymentUrl;

    //     if (redirectUrl) {
    //       window.location.replace(redirectUrl);
    //     }
    //   });
  };

  return (
    <div>
      <h1 className="text-3xl md:text-5xl font-bold  my-12 text-center">
        Order page
      </h1>
      <form onSubmit={handleOrderAndPayment}>
        <div className="block md:flex justify-between my-6">
          <div className="w-full m-0 md:m-6">
            <h1 className="text-xl md:text-2xl font-medium my-6">
              Billing Details
            </h1>
            <div className="m-2 md:m-12">
              <LabelInputContainer className="mb-4">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  placeholder="Road no. 00, house no. 10"
                  type="text"
                  name="address"
                  required
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="sylhet"
                  placeholder="Sylhet"
                  type="text"
                  name="city"
                  required
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="division">District *</Label>
                <Input
                  id="district"
                  placeholder="Sylhet"
                  type="text"
                  name="district"
                  required
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="phone">Phone * </Label>
                <Input
                  id="phone"
                  placeholder="016******"
                  type="number"
                  name="phone"
                  required
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="zip">Zip Code *</Label>
                <Input
                  id="zip"
                  placeholder="3100"
                  type="text"
                  name="zip"
                  required
                />
              </LabelInputContainer>
            </div>
          </div>
          <div className="w-full md:w-1/3 m-2 md:m-6">
            <h1 className="text-xl md:text-2xl font-medium my-6">Your Order</h1>
            <div>
              <h3 className="text-xl">Products</h3>
              <div className="">
                {carts?.length > 0 ? (
                  <>
                    {carts.map((item) => (
                      <div
                        key={item?._id}
                        className="grid grid-cols-3 justify-between items-center gap-6 p-3 m-3 rounded-md"
                      >
                        <div className="flex justify-center items-center">
                          <Image
                            loader={myLoader}
                            className="w-12 rounded-md mr-2"
                            src={item.productId.productImage}
                            alt="#"
                            height={1}
                            width={1}
                            unoptimized
                          />
                        </div>
                        <h5 className="text-gray-200 text-sm">
                          {item.productId.name} x <span>{item.quantity}</span>
                        </h5>

                        <div className="text-sm">${item.productId.price}</div>
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
            <div>
              <div className="text-md md:text-lg font-bold ">
                <p className="mr-2">Subtotal: ${Subtotal} </p>

                <p> </p>
              </div>
            </div>
            <div className="flex justify-center mt-6 md:mt-12 ease-in-out">
              <button
                type="submit"
                className="w-48 text-nowrap md:w-full px-3 py-2 bg-gray-700 hover:bg-green-500 rounded-lg transition duration-300 ease-in-out"
              >
                Proceed to Pay &rarr;
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

const OrderPageWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <OrderPage />
  </Suspense>
);

export default OrderPageWrapper;
