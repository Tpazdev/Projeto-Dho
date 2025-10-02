import { StatCard } from "../StatCard";
import { UserX, Building2, UserCog, TrendingUp } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="p-6 grid gap-4 md:grid-cols-4">
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
  );
}
