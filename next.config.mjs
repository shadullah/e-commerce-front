/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: "custom",
    domains: ["https://assets.aceternity.com/", "http://res.cloudinary.com/"],
  },
};

export default nextConfig;
