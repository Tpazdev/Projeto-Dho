import { LayoutDashboard, Users, Building2, UserCog, UserX, FileText, BarChart, GraduationCap, Target, ChevronRight, UserMinus, ClipboardList, Calendar } from "lucide-react";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Desligamentos",
    icon: UserX,
    subItems: [
      {
        title: "Entrevista de desligamento – por parte do colaborador",
        url: "/desligamentos/funcionario",
        icon: UserMinus,
      },
      {
        title: "Entrevista de desligamento – por parte da empresa",
        url: "/desligamentos/gestor",
        icon: UserCog,
      },
      {
        title: "Questionários de Desligamento",
        url: "/questionarios-desligamento",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "Avaliações de Experiência",
    icon: FileText,
    subItems: [
      {
        title: "01° Período",
        url: "/formularios-experiencia/primeiro-periodo",
        icon: Calendar,
      },
      {
        title: "02° Período",
        url: "/formularios-experiencia/segundo-periodo",
        icon: Calendar,
      },
    ],
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
              {items.map((item) => {
                // Se o item tem subItems, renderiza um menu expansível
                if (item.subItems) {
                  return (
                    <Collapsible key={item.title} asChild defaultOpen className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title} data-testid={`link-${item.title.toLowerCase()}`}>
                            <item.icon />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  className={location === subItem.url ? "bg-sidebar-accent" : ""}
                                  data-testid={`link-${subItem.title.toLowerCase().replace(/\s+/g, '-')}`}
                                >
                                  <Link href={subItem.url}>
                                    <subItem.icon />
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }
                
                // Caso contrário, renderiza um item normal
                return (
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
                );
              })}
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
