import FeaturedProducts from "@/app/products/page";
import Banner from "@/components/Home/Banner";
import Categories from "@/components/Home/Categories";
import Sold from "@/components/Home/Sold";
import Viewed from "@/components/Home/Viewed";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col">
      <div>
        <Banner />
        <FeaturedProducts />
        <Categories />
        <Viewed />
        <Sold />
      </div>
    </main>
  );
}
