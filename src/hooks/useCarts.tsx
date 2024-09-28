"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

const useCarts = () => {
  const [carts, setCarts] = useState<any[]>([]);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const getCartInfo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/carts/user/${userId}`
        );
        console.log(res?.data?.data);
        setCarts(res?.data?.data);
      } catch (error) {
        console.log(error);
      }
    };
    getCartInfo();
  }, [userId]);
  return [carts];
};

export default useCarts;
