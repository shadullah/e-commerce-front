import { DashboardSidebar } from "@/components/Shared/DashboardSidebar";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div>
      <DashboardSidebar>{children}</DashboardSidebar>
    </div>
  );
};

export default DashboardLayout;
