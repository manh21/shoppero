import { SidebarProvider } from "@/context/SidebarContext"
import Header from "@/components/header3";
import Sidebar from "@/components/sidebar";
import { HiChartPie, HiUser, HiShoppingBag, HiArrowSmRight} from "react-icons/hi";
import { signOut } from "next-auth/react";

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
      <SidebarProvider>
          <Header />
          <div className="flex">
              <main className="order-2 mx-4 mt-4 mb-24 flex-[1_0_16rem]">{children}</main>
              <div className="order-1">
                  <ActualSidebar />
              </div>
          </div>
      </SidebarProvider>
    )
}

function ActualSidebar(): JSX.Element {
  return (
    <Sidebar>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="/admin" icon={HiChartPie}>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item href="/admin/customer" icon={HiUser}>
            Customer
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiShoppingBag}>
            Products
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiArrowSmRight} onClick={() => signOut()}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}