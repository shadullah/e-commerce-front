"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, Suspense } from "react";

const OrderPage = () => {
  const router = useRouter();
  const search = useSearchParams();

  const ttl = search.get("ttl") || "0";

  // useEffect(() => {
  //   if (!ttl) {
  //     router.push("");
  //   }
  // }, [ttl, router]);

  const handlePayment = () => {
    const numeric = parseFloat(ttl);

    if (isNaN(numeric)) {
      console.error("invalid amount value");
      return;
    }

    axios
      .post("https://e-commerce-backend-gamma-five.vercel.app/create-payment", {
        amount: numeric,
        currency: "BDT",
      })
      .then((res) => {
        console.log(res);
        const redirectUrl = res.data.paymentUrl;

        if (redirectUrl) {
          window.location.replace(redirectUrl);
        }
      });
  };

  return (
    <div>
      <h1 className="text-5xl font-bold  my-12 text-center">Order page</h1>
      <div className="flex justify-center">
        <button
          className="px-3 py-2 bg-pink-500 rounded-lg"
          onClick={handlePayment}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

const OrderPageWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <OrderPage />
  </Suspense>
);

export default OrderPageWrapper;
