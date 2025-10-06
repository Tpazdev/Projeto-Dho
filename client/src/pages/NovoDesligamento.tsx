import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DesligamentoForm } from "@/components/DesligamentoForm";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function NovoDesligamento() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: empresas = [], isLoading: loadingEmpresas } = useQuery({
    queryKey: ["/api/empresas"],
  });

  const { data: gestores = [], isLoading: loadingGestores } = useQuery({
    queryKey: ["/api/gestores"],
  });

  const { data: funcionarios = [], isLoading: loadingFuncionarios } = useQuery({
    queryKey: ["/api/funcionarios"],
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/desligamentos", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/desligamentos"] });
      toast({
        title: "Desligamento registrado",
        description: "O desligamento foi registrado com sucesso.",
      });
      setTimeout(() => setLocation("/"), 1000);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao registrar desligamento.",
        variant: "destructive",
      });
    },
  });

  const isLoading = loadingEmpresas || loadingGestores || loadingFuncionarios;

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Novo Desligamento</h1>
        <p className="text-muted-foreground mt-1">
          Registre um novo desligamento de funcionário
        </p>
      </div>

      <DesligamentoForm
        empresas={empresas}
        gestores={gestores}
        funcionarios={funcionarios}
        onSubmit={(data) => mutation.mutate(data)}
        isLoading={mutation.isPending}
      />
    </div>
  );
}
