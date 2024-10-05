/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: "custom",
    domains: ["https://assets.aceternity.com/", "http://res.cloudinary.com/"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
        // "https://e-commerce-backend-gamma-five.vercel.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
