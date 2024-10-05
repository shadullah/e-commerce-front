export default async function getAllProducts() {
  const res = await fetch(
    "https://e-commerce-backend-gamma-five.vercel.app/api/v1/products",
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  console.log(data);
  return data;
}
