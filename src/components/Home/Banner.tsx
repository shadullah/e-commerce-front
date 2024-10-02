"use client";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import Image from "next/image";
import withAutoplay from "react-awesome-slider/dist/autoplay";
import img2 from "../../img/ads.webp";
import img1 from "../../img/zerocal.webp";

const myLoader = ({ src }: { src: string }) => {
  return src;
};

const Banner = () => {
  const AutoplaySlider = withAutoplay(AwesomeSlider);

  return (
    <div>
      <AutoplaySlider
        play={true}
        interval={5000}
        cancelOnInteraction={false}
        className="slider h-24 md:h-96"
      >
        <div className="">
          <Image unoptimized loader={myLoader} src={img1} alt="1" />
        </div>

        {/* 2nd slide */}

        <div className="">
          <Image unoptimized loader={myLoader} src={img2} alt="1"></Image>
        </div>
      </AutoplaySlider>
    </div>
  );
};

export default Banner;
