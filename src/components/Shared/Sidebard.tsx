"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { IconHome, IconSettings, IconUserBolt } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GiPillDrop } from "react-icons/gi";
import { IoCartOutline } from "react-icons/io5";
import { FaRegUser, FaUserAlt } from "react-icons/fa";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import useUsers from "@/hooks/useUsers";
import { RiShoppingBagLine } from "react-icons/ri";
import { jwtDecode } from "jwt-decode";

const myLoader = ({ src }: { src: string }) => {
  return src;
};

interface User {
  fullname: string;
  photo: string;
}

export function Sidebard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedin] = useState(false);
  const users = useUsers();

  const checkLoginStatus = () => {
    const access = localStorage.getItem("accessToken");
    if (access) {
      const decodedToken: any = jwtDecode(access);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp && decodedToken.exp < currentTime) {
        handleLogout();
      } else {
        setIsLoggedin(true);
      }
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, [pathname]);
  const handleLogout = () => {
    // setLoading(true);
    try {
      localStorage.removeItem("id");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      setIsLoggedin(false);

      router.push("/login");
    } catch (error) {
      console.log(error);
      toast.error("logout failed", { duration: 3000 });
    } finally {
      // setLoading(false);
    }
  };

  const links = [
    {
      label: "Home",
      href: "/",
      icon: (
        <IconHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Products",
      href: "/products",
      icon: (
        <RiShoppingBagLine className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Category",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Cart",
      href: "/cart",
      icon: (
        <IoCartOutline className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="flex flex-col h-full justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="flex flex-col mt-8 gap-2">
              {links.map((link, index) => (
                <SidebarLink key={index} link={link} />
              ))}
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 mt-3 cursor-pointer"
                  >
                    <MdOutlineSpaceDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                    <span className="text-neutral-700 dark:text-neutral-200 text-sm">
                      Dashboard
                    </span>
                  </Link>
                </>
              ) : null}

              <div
                onClick={
                  isLoggedIn ? handleLogout : () => router.push("/login")
                }
                className="flex items-center gap-2 mt-3 cursor-pointer"
              >
                <FaRegUser className="text-neutral-700 dark:text-neutral-200 h-4 w-5 flex-shrink-0" />
                <span className="text-neutral-700 text-sm dark:text-neutral-200">
                  {isLoggedIn ? "Logout" : "Login"}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex text-center gap-2 px-4 py-2 border-t">
            {isLoggedIn ? (
              <>
                <SidebarLink
                  link={{
                    label: users?.fullname,
                    href: "/dashboard",
                    icon: (
                      <Image
                        loader={myLoader}
                        src={
                          users?.photo ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        className="h-7 w-7 rounded-full"
                        width={50}
                        height={50}
                        alt="Avatar"
                        unoptimized
                      />
                    ),
                  }}
                />
              </>
            ) : (
              <>
                <SidebarLink
                  link={{
                    label: "Guest",
                    href: "/dashboard",
                    icon: (
                      <Image
                        loader={myLoader}
                        src={
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        className="h-7 w-7 rounded-full"
                        width={50}
                        height={50}
                        alt="Avatar"
                        unoptimized
                      />
                    ),
                  }}
                />
              </>
            )}
          </div>
          {open && <p className="mt-4 text-sm">&copy; Copyright reserved</p>}
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 overflow-auto py-2 sm:py-4 md:py-8">
        <div className="w-full px-2 sm:px-4 md:px-8">{children}</div>
      </main>
    </div>
  );
}

export const Logo = () => (
  <Link
    href="/"
    className="font-normal flex space-x-2 items-center text-sm  text-black py-1 relative z-20"
  >
    <GiPillDrop className="h-6 w-6 text-violet-500 flex-shrink-0" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium text-3xl text-black dark:text-white whitespace-pre"
    >
      Lazz <span className="text-violet-500">Pharma</span>
    </motion.span>
  </Link>
);

export const LogoIcon = () => (
  <Link
    href="/"
    className="font-normal flex space-x-2 items-center text-sm  text-black py-1 relative z-20"
  >
    <GiPillDrop className="h-6 w-6 text-violet-500 flex-shrink-0" />
  </Link>
);
