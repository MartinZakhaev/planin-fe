"use client"

import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import {
  Users,
  Building2,
  Briefcase,
  CreditCard,
  ClipboardList,
  FileText,
  Hammer,
  Wrench,
  HardHat,
  Package
} from "lucide-react"

// Updated menu structure
const menuGroups = [
  {
    label: "Admin & Billing",
    items: [
      { title: "Users", url: "/dashboard/users", icon: Users },
      { title: "Organizations", url: "/dashboard/organizations", icon: Building2 },
      { title: "Plans", url: "/dashboard/plans", icon: FileText },
      { title: "Subscriptions", url: "/dashboard/subscriptions", icon: CreditCard },
      { title: "Audit Logs", url: "/dashboard/audit-logs", icon: ClipboardList },
    ]
  },
  {
    label: "Master Data",
    items: [
      { title: "Units", url: "/dashboard/units", icon: Wrench },
      { title: "Work Divisions", url: "/dashboard/work-divisions", icon: Briefcase },
      { title: "Task Catalogs", url: "/dashboard/task-catalogs", icon: ClipboardList },
      { title: "Item Catalogs", url: "/dashboard/item-catalogs", icon: Package },
    ]
  },
  {
    label: "Projects",
    items: [
      { title: "All Projects", url: "/dashboard/projects", icon: HardHat },
    ]
  }
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // Temporary dummy teams for now
  const teams = [
    { name: "Acme Inc", logo: Building2, plan: "Enterprise" },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
