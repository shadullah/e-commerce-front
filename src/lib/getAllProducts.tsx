export default async function getAllProducts() {
  const res = await fetch("/api/v1/products", {
    cache: "no-store",
  });
  const data = await res.json();
  console.log(data);
  return data;
}
