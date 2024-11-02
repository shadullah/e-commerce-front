"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/cn";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, Suspense } from "react";
import Cart from "../cart/page";

const OrderPage = () => {
  const router = useRouter();
  const search = useSearchParams();
  const myId = localStorage.getItem("id");

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
      .post("/api/v1/create-payment", {
        customer: myId,
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
      <div className="block md:flex justify-between my-6">
        <div className="w-1/2 m-6">
          <h1 className="text-2xl font-medium my-6">Billing Details</h1>
          <div className="my-3">
            <LabelInputContainer className="mb-4">
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                placeholder="Road no. 00, house no. 10"
                type="text"
                name="street_address"
                required
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="street">City *</Label>
              <Input
                id="sylhet"
                placeholder="Sylhet"
                type="text"
                name="sylhet_city"
                required
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="state">State *</Label>
              <Input
                id="street"
                placeholder="Sylhet"
                type="text"
                name="state"
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
                name="zip_code"
                required
              />
            </LabelInputContainer>
          </div>
        </div>
        <div className="w-1/2 m-6">
          <h1 className="text-2xl font-medium my-6">Your Order</h1>
          <div>{/* <Cart /> */}</div>
          <div className="flex justify-center">
            <button
              className="w-full px-3 py-2 bg-gray-700 hover:bg-green-500 rounded-lg"
              onClick={handlePayment}
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>
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
