"use client";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const myLoader = ({ src }: { src: string }) => {
  return src;
};

type Category = {
  id: string;
  name: string;
  thumbnail: string;
};

const Categories = () => {
  const [cates, setCates] = useState<Category[]>([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const getCates = async () => {
      try {
        const res = await axios.get(
          "https://e-commerce-backend-gamma-five.vercel.app/api/v1/category/all/"
        );
        // console.log(res.data);
        setCates(res?.data?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoad(false);
      }
    };
    getCates();
  }, []);

  return (
    <div>
      <div className="my-3 md:my-8">
        {/* <h1 className=" text-3xl font-bold text-center">Category</h1> */}
        {load ? (
          <>
            <p className="text-center text-lg font-bold my-12">Loading...</p>
          </>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 md:gap-12 mx-auto mt-3 p-1 md:p-6">
              {cates.map((cat, index) => (
                <div key={cat?.id || index}>
                  <div className="bg-pink-100 text-gray-800 block md:flex items-center justify-between p-2 md:p-6 rounded-lg">
                    <h3 className="text-sm md:text-2xl font-bold">
                      {cat.name}
                    </h3>
                    <div>
                      <Image
                        loader={myLoader}
                        src={cat?.thumbnail}
                        alt="category"
                        height={300}
                        width={300}
                        unoptimized
                        className="h-5 md:h-12 w-5 md:w-12 mx-auto rounded-md"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Categories;
