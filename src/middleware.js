// "use client";

// import { NextResponse } from "next/server";

// const getId = () => {
//   if (typeof window === "undefined") {
//     return "";
//   }
//   return localStorage.getItem("id");
// };

// export const middleware = (req) => {
//   if (!getId()) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
// };

// export const config = {
//   matcher: ["/dashboard", "/order"],
// };
