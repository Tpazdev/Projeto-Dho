import { UserX, Building2, UserCog, TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/StatCard";
import { DashboardCharts } from "@/components/DashboardCharts";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Desligamento {
  id: number;
  dataDesligamento: string;
  funcionarioId: number;
  empresaId: number;
  gestorId: number;
  motivo?: string;
  tipoDesligamento: string;
}

interface DadosGrafico {
  labels: string[];
  data: number[];
}

export default function Dashboard() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1), // Início do ano
    to: new Date(), // Hoje
  });

  const { data: gestoresData } = useQuery<DadosGrafico>({
    queryKey: ["/api/dados/desligamentos_por_gestor"],
  });

  const { data: empresasData } = useQuery<DadosGrafico>({
    queryKey: ["/api/dados/desligamentos_por_empresa"],
  });

  const { data: desligamentos = [] } = useQuery<Desligamento[]>({
    queryKey: ["/api/desligamentos"],
  });

  const { data: empresas = [] } = useQuery<any[]>({
    queryKey: ["/api/empresas"],
  });

  const { data: gestores = [] } = useQuery<any[]>({
    queryKey: ["/api/gestores"],
  });

  // Filtrar desligamentos pelo período selecionado
  const desligamentosFiltrados = desligamentos.filter((d) => {
    if (!date?.from) return true;
    const dataDesligamento = new Date(d.dataDesligamento);
    const from = new Date(date.from);
    const to = date.to ? new Date(date.to) : new Date();
    
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);
    dataDesligamento.setHours(0, 0, 0, 0);
    
    return dataDesligamento >= from && dataDesligamento <= to;
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

  const totalDesligamentos = desligamentosFiltrados.length;
  const totalEmpresas = empresas.length;
  const totalGestores = gestores.length;

  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const desligamentosLastMonth = desligamentosFiltrados.filter((d) => {
    const dataD = new Date(d.dataDesligamento);
    return dataD >= lastMonth && dataD < now;
  }).length;

  // Funções para filtros rápidos
  const setHoje = () => {
    setDate({ from: new Date(), to: new Date() });
  };

  const setEsteMes = () => {
    const agora = new Date();
    setDate({
      from: new Date(agora.getFullYear(), agora.getMonth(), 1),
      to: agora,
    });
  };

  const setEsteAno = () => {
    const agora = new Date();
    setDate({
      from: new Date(agora.getFullYear(), 0, 1),
      to: agora,
    });
  };

  const limparFiltro = () => {
    setDate(undefined);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Análise de dados e estatísticas de desligamentos
        </p>
      </div>

      {/* Filtro de Data */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtrar por Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal min-w-[280px]",
                    !date && "text-muted-foreground"
                  )}
                  data-testid="button-filtro-data"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                        {format(date.to, "dd/MM/yyyy", { locale: ptBR })}
                      </>
                    ) : (
                      format(date.from, "dd/MM/yyyy", { locale: ptBR })
                    )
                  ) : (
                    <span>Selecione um período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  locale={ptBR}
                  data-testid="calendar-filtro"
                />
              </PopoverContent>
            </Popover>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant="secondary"
                size="sm"
                onClick={setHoje}
                data-testid="button-filtro-hoje"
              >
                Hoje
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={setEsteMes}
                data-testid="button-filtro-mes"
              >
                Este Mês
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={setEsteAno}
                data-testid="button-filtro-ano"
              >
                Este Ano
              </Button>
              {date && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={limparFiltro}
                  data-testid="button-limpar-filtro"
                >
                  Limpar Filtro
                </Button>
              )}
            </div>
          </div>

          {date?.from && (
            <p className="text-sm text-muted-foreground mt-3">
              Exibindo dados de{" "}
              <strong>{format(date.from, "dd/MM/yyyy", { locale: ptBR })}</strong>
              {date.to && (
                <>
                  {" até "}
                  <strong>{format(date.to, "dd/MM/yyyy", { locale: ptBR })}</strong>
                </>
              )}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Desligamentos"
          value={totalDesligamentos}
          icon={UserX}
          description="No período selecionado"
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
