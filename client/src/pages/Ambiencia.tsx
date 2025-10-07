import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, BarChart, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

type PesquisaClima = {
  id: number;
  titulo: string;
  descricao: string | null;
  dataInicio: string;
  dataFim: string;
  status: string;
  anonima: number;
  empresaId: number | null;
};

const pesquisaSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().optional(),
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
  dataFim: z.string().min(1, "Data de fim é obrigatória"),
  status: z.string().default("ativa"),
  anonima: z.boolean().default(true),
  empresaId: z.coerce.number().optional().nullable(),
});

type PesquisaFormData = z.infer<typeof pesquisaSchema>;

export default function Ambiencia() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPesquisa, setSelectedPesquisa] = useState<PesquisaClima | null>(null);

  const { data: pesquisas = [], isLoading } = useQuery<PesquisaClima[]>({
    queryKey: ["/api/pesquisas-clima"],
  });

  const { data: empresas = [] } = useQuery<{ id: number; nome: string }[]>({
    queryKey: ["/api/empresas"],
  });

  const form = useForm<PesquisaFormData>({
    resolver: zodResolver(pesquisaSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      dataInicio: "",
      dataFim: "",
      status: "ativa",
      anonima: true,
      empresaId: null,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: PesquisaFormData) => {
      const payload = {
        ...data,
        anonima: data.anonima ? 1 : 0,
      };
      return await apiRequest("POST", "/api/pesquisas-clima", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pesquisas-clima"] });
      toast({
        title: "Sucesso!",
        description: "Pesquisa criada com sucesso",
      });
      setDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar a pesquisa",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/pesquisas-clima/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pesquisas-clima"] });
      toast({
        title: "Sucesso!",
        description: "Pesquisa deletada com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível deletar a pesquisa",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PesquisaFormData) => {
    createMutation.mutate(data);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja deletar esta pesquisa? Todas as perguntas e respostas serão deletadas.")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ativa: { label: "Ativa", className: "bg-green-500/10 text-green-500 border-green-500/20" },
      encerrada: { label: "Encerrada", className: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
      rascunho: { label: "Rascunho", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ativa;
    return (
      <Badge variant="outline" className={config.className} data-testid={`badge-status-${status}`}>
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold" data-testid="text-page-title">
            Pesquisas de Clima Organizacional
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">
            Pesquisas de Clima Organizacional
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie pesquisas de clima e analise o ambiente de trabalho
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} data-testid="button-criar-pesquisa">
          <Plus className="h-4 w-4 mr-2" />
          Nova Pesquisa
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pesquisas.map((pesquisa) => (
          <Card key={pesquisa.id} data-testid={`card-pesquisa-${pesquisa.id}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{pesquisa.titulo}</CardTitle>
                {getStatusBadge(pesquisa.status)}
              </div>
              {pesquisa.descricao && (
                <CardDescription className="line-clamp-2">{pesquisa.descricao}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(new Date(pesquisa.dataInicio), "dd/MM/yyyy", { locale: ptBR })} -{" "}
                  {format(new Date(pesquisa.dataFim), "dd/MM/yyyy", { locale: ptBR })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{pesquisa.anonima ? "Anônima" : "Identificada"}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.location.href = `/ambiencia/${pesquisa.id}/perguntas`}
                  data-testid={`button-editar-${pesquisa.id}`}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Perguntas
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = `/ambiencia/${pesquisa.id}/analise`}
                  data-testid={`button-analise-${pesquisa.id}`}
                >
                  <BarChart className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDelete(pesquisa.id)}
                  data-testid={`button-deletar-${pesquisa.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pesquisas.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground" data-testid="text-empty-state">
              Nenhuma pesquisa de clima encontrada
            </p>
            <Button onClick={() => setDialogOpen(true)} className="mt-4" data-testid="button-criar-primeira">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Pesquisa
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Pesquisa de Clima</DialogTitle>
            <DialogDescription>
              Crie uma nova pesquisa para avaliar o clima organizacional
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Pesquisa de Clima Q1 2025" data-testid="input-titulo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Descreva o objetivo da pesquisa..."
                        className="min-h-[80px]"
                        data-testid="textarea-descricao"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dataInicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Início</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-data-inicio" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataFim"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Fim</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-data-fim" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-status">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ativa" data-testid="option-ativa">Ativa</SelectItem>
                        <SelectItem value="rascunho" data-testid="option-rascunho">Rascunho</SelectItem>
                        <SelectItem value="encerrada" data-testid="option-encerrada">Encerrada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="anonima"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Pesquisa Anônima</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        As respostas não serão associadas aos funcionários
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-anonima"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} data-testid="button-cancelar">
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending} data-testid="button-salvar">
                  Criar Pesquisa
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
