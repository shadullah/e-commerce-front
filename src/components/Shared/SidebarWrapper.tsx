"use client";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
import { Sidebard } from "./Sidebard";

const SidebarWrapper = ({ children }: { children: ReactNode }) => {
  const pathName = usePathname();
  const isDash = pathName.startsWith("/dashboard");

  if (isDash) {
    return <>{children}</>;
  }

  return <Sidebard>{children}</Sidebard>;
};

export default SidebarWrapper;
