"use client"

import type * as React from "react"
import { LayoutDashboard, MessageSquare, Users, UserCog } from "lucide-react"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

// This is the updated sample data for your chat app admin panel.
const data = {
  user: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Chat Room Management",
      url: "/chat-rooms",
      icon: MessageSquare,
    },
    {
      title: "User Management",
      url: "/users",
      icon: Users,
    },
    {
      title: "Admin Profile",
      url: "/admin-profile",
      icon: UserCog,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>{/* You can add a logo or app name here if needed */}</SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

