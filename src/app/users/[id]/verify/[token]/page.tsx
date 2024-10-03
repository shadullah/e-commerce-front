"use client";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";

const Email = () => {
  const [valUrl, setValUrl] = useState(false);
  const param = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `http://localhost:8000/api/v1/users/${param.id}/verify/${param.token}`;
        console.log(param.id);
        console.log(param.token);
        const { data } = await axios.get(url);
        console.log(data);
        setValUrl(true);
      } catch (error) {
        console.log(error);
      }
    };
    verifyEmailUrl();
  }, [param]);

  return (
    <div className="flex justify-center items-center">
      {valUrl ? (
        <>
          <TiTick className="text-7xl text-green-600" />
          <h3>Email Verified Successfully!!!</h3>
          <Link href="/authenticate/login">Login</Link>
        </>
      ) : (
        <>
          <h1>404 not found</h1>
        </>
      )}
    </div>
  );
};

export default Email;
