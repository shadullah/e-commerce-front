import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";
import { Audio } from "react-loader-spinner";

const Email = () => {
  const [valUrl, setValUrl] = useState(false);
  const param = useParams();
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `/api/users/${param.id}/verify/${param.token}`;
        const { data } = await axios.get(url);
        console.log(data);
        setValUrl(true);
      } catch (error) {
        console.log(error);
      } finally {
        setLoad(false);
      }
    };
    verifyEmailUrl();
  }, [param]);

  return (
    <div className="h-screen flex justify-center items-center">
      {load ? (
        <>
          <Audio />
        </>
      ) : (
        <>
          valUrl ? (
          <div>
            <TiTick className="text-7xl text-green-600" />
            <h3>Email Verified Successfully!!!</h3>
            <br />
            <p>
              <Link href="/login">
                <button className="px-3 py-4 bg-green-600">Login</button>
              </Link>
            </p>
          </div>
          ) : (<h1>404 not found</h1>)
        </>
      )}
    </div>
  );
};

export default Email;
