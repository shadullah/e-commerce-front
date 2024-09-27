"use client";
import React, { useEffect, useState } from "react";
import { IconSettings, IconUserBolt } from "@tabler/icons-react";

import { GiPillDrop } from "react-icons/gi";
import { GoHome } from "react-icons/go";
import { IoCartOutline, IoSearch } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function Sidebard() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedin] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const access = localStorage.getItem("accessToken");
      setIsLoggedin(!!access);
    };

    checkLoginStatus();

    if (pathname) {
      checkLoginStatus();
    }
  }, [router, pathname]);

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
        <GoHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Products",
      href: "/products",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
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
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen overflow-y-auto"
      )}
    >
      {/* <Sidebar open={open} setOpen={setOpen}> */}
      <Sidebar open={true} setOpen={() => {}}>
        <SidebarBody className="justify-between">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Link href="/">
              {open ? (
                <GiPillDrop />
              ) : (
                <>
                  <div className="flex items-center text-3xl justify-evenly">
                    <span className="text-pink-400">
                      <GiPillDrop />
                    </span>
                    <span className="font-bold">
                      Lazz <span className="text-pink-400">Pharma</span>
                    </span>
                  </div>
                </>
              )}
            </Link>

            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}

              <div
                onClick={
                  isLoggedIn ? handleLogout : () => router.push("/login")
                }
                className="flex items-center gap-2 cursor-pointer"
              >
                <FaRegUser className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                <span className="text-neutral-700 dark:text-neutral-200">
                  {isLoggedIn ? "Logout" : "Login"}
                </span>
              </div>
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <Image
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}
