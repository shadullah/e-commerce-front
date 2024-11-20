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

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const form = e.target as HTMLFormElement;
    // const title = form.title.value;
    // const description = form.des.value;
    // const price = form.price.value;
    // const discount = form.discount.value;
    // const catSelected = form.category.value;
    // console.log(catSelected);

    const formData = new FormData(e.currentTarget);
    // const data = ;

    // const category = categories.find((cat) => cat._id === catSelected);

    const fileInput = e.currentTarget.querySelector(
      'input[type="file"'
    ) as HTMLInputElement;

    if (fileInput?.files?.[0]) {
      const file = fileInput.files[0];
      formData.append("image", file);
    }

    console.log(Object.fromEntries(formData.entries()));

    try {
      await axios.post(`http://localhost:8000/api/v1/products/all/`, formData, {
        headers: {
          Authorization: `Token ${localStorage.getItem("accessToken")}`,
        },
      });
      toast.success("PRoduct added successfully", { duration: 3000 });
    } catch (err) {
      console.log(err);
      toast.error("Addition of product failed", { duration: 3000 });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Add Products</h1>
      <form onSubmit={handleAdd} className="py-6 md:py-16">
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
                className="appearance-none border-b-4 outline-none  border-gray-700 w-full py-2 px-3 bg-orange-300/10"
                name="title"
                placeholder="Product Title"
                type="text"
                required
              />
            </div>

            <div className="w-full px-3 mb-6">
              <textarea
                className="appearance-none border-b-4 outline-none  border-gray-700 w-full py-2 px-3 bg-orange-300/10"
                name="des"
                placeholder="Write Product description here..."
                required
              />
            </div>
            <div className="w-full flex justify-between space-x-2 px-3 mb-6">
              <input
                className="appearance-none border-b-4 outline-none  border-gray-700 w-full py-2 px-3 bg-orange-300/10"
                name="price"
                type="number"
                placeholder="20"
                required
              />
              <input
                className="appearance-none border-b-4 outline-none  border-gray-700 w-full py-2 px-3 bg-orange-300/10"
                name="discount"
                type="number"
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
              >
                <option className="text-base" value="" disabled>
                  Select Category here
                </option>

                {categories?.map((cat) => (
                  <option key={cat?._id} value={cat?._id}>
                    {cat?.name}
                  </option>
                ))}
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
