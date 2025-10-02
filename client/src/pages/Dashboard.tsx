import { UserX, Building2, UserCog, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { DashboardCharts } from "@/components/DashboardCharts";

export default function Dashboard() {
  const mockGestoresData = [
    { name: "Ana Santos", value: 8 },
    { name: "João Costa", value: 5 },
    { name: "Patricia Lima", value: 3 },
    { name: "Roberto Alves", value: 7 },
  ];

  const mockEmpresasData = [
    { name: "Tech Solutions", value: 15 },
    { name: "Inovação Corp", value: 10 },
    { name: "Digital Ventures", value: 8 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Análise de dados e estatísticas de desligamentos
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Desligamentos"
          value={33}
          icon={UserX}
          description="Último mês"
        />
        <StatCard
          title="Empresas"
          value={3}
          icon={Building2}
          description="Ativas no sistema"
        />
        <StatCard
          title="Gestores"
          value={12}
          icon={UserCog}
          description="Cadastrados"
        />
        <StatCard
          title="Média Mensal"
          value="11"
          icon={TrendingUp}
          description="Últimos 3 meses"
        />
      </div>

      <DashboardCharts gestoresData={mockGestoresData} empresasData={mockEmpresasData} />
    </div>
  );
}
