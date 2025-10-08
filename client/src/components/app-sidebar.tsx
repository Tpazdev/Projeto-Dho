import { LayoutDashboard, Users, Building2, UserCog, UserX, FileText, BarChart, GraduationCap, Target } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Desligamentos",
    url: "/",
    icon: UserX,
  },
  {
    title: "Avaliações de Experiência",
    url: "/formularios-experiencia",
    icon: FileText,
  },
  {
    title: "Treinamentos",
    url: "/treinamentos",
    icon: GraduationCap,
  },
  {
    title: "PDI",
    url: "/pdi",
    icon: Target,
  },
  {
    title: "Ambiencia - Clima",
    url: "/ambiencia",
    icon: BarChart,
  },
  {
    title: "Responder Pesquisas",
    url: "/ambiencia/responder",
    icon: FileText,
  },
];

const cadastroItems = [
  {
    title: "Empresas",
    url: "/empresas",
    icon: Building2,
  },
  {
    title: "Gestores",
    url: "/gestores",
    icon: UserCog,
  },
  {
    title: "Funcionários",
    url: "/funcionarios",
    icon: Users,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={location === item.url ? "bg-sidebar-accent" : ""}
                    data-testid={`link-${item.title.toLowerCase()}`}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Cadastros</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {cadastroItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={location === item.url ? "bg-sidebar-accent" : ""}
                    data-testid={`link-${item.title.toLowerCase()}`}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
