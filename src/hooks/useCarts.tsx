"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

const useCarts = () => {
  const [carts, setCarts] = useState<any[]>([]);

  useEffect(() => {
    const getCartInfo = async () => {
      try {
        const userId = localStorage.getItem("id");

        const res = await axios.get(
          `https://e-commerce-backend-gamma-five.vercel.app/api/v1/carts/user/${userId}`
        );
        console.log(res?.data?.data);
        setCarts(res?.data?.data);
      } catch (error) {
        console.log(error);
      }
    };
    getCartInfo();
  }, []);
  return [carts];
};

export default useCarts;
