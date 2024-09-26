import FeaturedProducts from "@/app/products/page";
import Banner from "@/components/Banner";
import Categories from "@/components/Categories";
import HeroSection from "@/components/HeroSection";
import { Sidebard } from "@/components/Sidebard";
import Sold from "@/components/Sold";
import Viewed from "@/components/Viewed";
import Image from "next/image";

export default function Home() {
  return (
    <main className="max-w-[1100px] mx-auto">
      {/* <HeroSection /> */}
      <Banner />
      <Categories />
      <FeaturedProducts />
      <Viewed />
      <Sold />
    </main>
  );
}
