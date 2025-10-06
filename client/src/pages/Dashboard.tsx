import { UserX, Building2, UserCog, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/StatCard";
import { DashboardCharts } from "@/components/DashboardCharts";

export default function Dashboard() {
  const { data: gestoresData } = useQuery({
    queryKey: ["/api/dados/desligamentos_por_gestor"],
  });

  const { data: empresasData } = useQuery({
    queryKey: ["/api/dados/desligamentos_por_empresa"],
  });

  const { data: desligamentos = [] } = useQuery({
    queryKey: ["/api/desligamentos"],
  });

  const { data: empresas = [] } = useQuery({
    queryKey: ["/api/empresas"],
  });

  const { data: gestores = [] } = useQuery({
    queryKey: ["/api/gestores"],
  });

  const chartGestoresData = gestoresData
    ? gestoresData.labels.map((label: string, i: number) => ({
        name: label,
        value: gestoresData.data[i],
      }))
    : [];

  const chartEmpresasData = empresasData
    ? empresasData.labels.map((label: string, i: number) => ({
        name: label,
        value: empresasData.data[i],
      }))
    : [];

  const totalDesligamentos = desligamentos.length;
  const totalEmpresas = empresas.length;
  const totalGestores = gestores.length;

  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const desligamentosLastMonth = desligamentos.filter((d: any) => {
    const date = new Date(d.dataDesligamento);
    return date >= lastMonth && date < now;
  }).length;

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
          value={totalDesligamentos}
          icon={UserX}
          description="Total registrado"
        />
        <StatCard
          title="Empresas"
          value={totalEmpresas}
          icon={Building2}
          description="Ativas no sistema"
        />
        <StatCard
          title="Gestores"
          value={totalGestores}
          icon={UserCog}
          description="Cadastrados"
        />
        <StatCard
          title="Último Mês"
          value={desligamentosLastMonth}
          icon={TrendingUp}
          description="Desligamentos"
        />
      </div>

      {gestoresData && empresasData && (
        <DashboardCharts gestoresData={chartGestoresData} empresasData={chartEmpresasData} />
      )}
    </div>
  );
}
