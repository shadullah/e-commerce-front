"use client";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const myLoader = ({ src }: { src: string }) => {
  return src;
};

interface Category {
  _id: string;
  name: string;
  slug: string;
  thumbnail: string;
}

const Add_products = () => {
  const [imgPrev, setImgPrev] = useState<string | null>("");
  const [categories, setCategories] = useState<Category[]>([]);

  const handleImgPrev = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImgPrev(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await axios.get(`/api/v1/category/all/`);
        setCategories(res.data?.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
        toast.error("Category could not fetched");
      }
    };
    getCategory();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold">Add Products</h1>
      <form
        //   onSubmit={handleUpdate}
        className="py-6 md:py-16"
      >
        <div className="block md:flex">
          <div className="w-1/2 px-3 mb-6">
            {imgPrev && (
              <div>
                <Image
                  src={imgPrev}
                  alt="imgPrev"
                  loader={myLoader}
                  height={600}
                  width={600}
                />
              </div>
            )}
            <input
              // onChange={(e) => setUrl(e.target.value)}
              className="appearance-none border-b-4 outline-none  border-gray-700 w-full py-2 px-3 text-center"
              type="file"
              required
              accept="image/*"
              onChange={handleImgPrev}
            />
          </div>
          <div className="w-1/2">
            <div className="w-full px-3 mb-6">
              <input
                // onChange={(e) => setTitle(e.target.value)}
                className="appearance-none border-b-4 outline-none  border-gray-700 w-full py-2 px-3 bg-orange-300/10"
                name="title"
                placeholder="Product Title"
                type="text"
                // value={title}
                required
              />
            </div>

            <div className="w-full px-3 mb-6">
              <textarea
                // onChange={(e) => setDes(e.target.value)}
                className="appearance-none border-b-4 outline-none  border-gray-700 w-full py-2 px-3 bg-orange-300/10"
                name="des"
                // type="text"
                // value={des}
                placeholder="Write Product description here..."
                required
              />
            </div>
            <div className="w-full flex justify-between space-x-2 px-3 mb-6">
              <input
                // onChange={(e) => setCondition(e.target.value)}
                className="appearance-none border-b-4 outline-none  border-gray-700 w-full py-2 px-3 bg-orange-300/10"
                name="price"
                type="number"
                // value={condition}
                placeholder="20"
                required
              />
              <input
                // onChange={(e) => setCondition(e.target.value)}
                className="appearance-none border-b-4 outline-none  border-gray-700 w-full py-2 px-3 bg-orange-300/10"
                name="discount"
                type="number"
                // value={condition}
                placeholder="discount percentage e.g 2"
                required
              />
            </div>
            <div className="w-full px-3 mb-6">
              <select
                required
                className="appearance-none border-b-4 outline-none  border-gray-700 w-full py-2 px-3 bg-black"
                name="category"
                id="category"
                defaultValue=""
                // value={selectedCategory}
                // onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option className="text-base" value="" disabled>
                  Select Category here
                </option>

                {/* {categories.map((prio) => console.log(prio.id))} */}
                {categories?.map((cat) => (
                  <option key={cat?._id} value={cat?.slug}>
                    {cat?.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full px-3 mb-6">
              <select
                className="appearance-none border-b-4 outline-none border-gray-700 w-full py-2 px-3 bg-gray-600"
                name="stock"
                required
                defaultValue=""
                // onChange={(e) => setStock(e.target.value === "true")}
              >
                <option value="" disabled>
                  Select Stock Status
                </option>
                <option value="true">True</option>
              </select>
            </div>
          </div>
        </div>
        <div className="text-center mt-6">
          <input
            className="bg-violet-600 px-4 py-3 cursor-pointer rounded-lg font-bold"
            type="submit"
            value="Add Product"
          />
        </div>
      </form>
    </div>
  );
};

export default Add_products;
