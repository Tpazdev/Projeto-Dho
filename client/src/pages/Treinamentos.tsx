import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Plus, Loader2, Eye, Search } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "wouter";

type TreinamentoItem = {
  id: number;
  titulo: string;
  tipo: string;
  descricao: string | null;
  gestorId: number;
  gestorNome: string | null;
  dataInicio: string;
  dataFim: string;
  cargaHoraria: number | null;
  status: string;
};

const treinamentoSchema = z.object({
  titulo: z.string().min(1, "Título obrigatório"),
  tipo: z.enum(["onboarding", "tecnico", "comportamental"]),
  descricao: z.string().optional(),
  gestorId: z.coerce.number().min(1, "Gestor obrigatório"),
  dataInicio: z.string().min(1, "Data de início obrigatória"),
  dataFim: z.string().min(1, "Data de fim obrigatória"),
  cargaHoraria: z.coerce.number().min(1, "Carga horária obrigatória"),
  status: z.enum(["planejado", "em_andamento", "concluido"]).default("planejado"),
});

type TreinamentoFormData = z.infer<typeof treinamentoSchema>;

export default function Treinamentos() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: treinamentos = [], isLoading } = useQuery<TreinamentoItem[]>({
    queryKey: ["/api/treinamentos"],
  });

  const { data: gestores = [] } = useQuery<{ id: number; nome: string }[]>({
    queryKey: ["/api/gestores"],
  });

  const form = useForm<TreinamentoFormData>({
    resolver: zodResolver(treinamentoSchema),
    defaultValues: {
      titulo: "",
      tipo: "onboarding",
      descricao: "",
      gestorId: 0,
      dataInicio: "",
      dataFim: "",
      cargaHoraria: 0,
      status: "planejado",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TreinamentoFormData) => {
      return await apiRequest("POST", "/api/treinamentos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/treinamentos"] });
      toast({
        title: "Sucesso!",
        description: "Treinamento criado com sucesso",
      });
      setDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o treinamento",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TreinamentoFormData) => {
    createMutation.mutate(data);
  };

  const getTipoLabel = (tipo: string) => {
    const tipos = {
      onboarding: "Onboarding",
      tecnico: "Técnico",
      comportamental: "Comportamental",
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  const getTipoBadgeColor = (tipo: string) => {
    const cores = {
      onboarding: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      tecnico: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      comportamental: "bg-green-500/10 text-green-500 border-green-500/20",
    };
    return cores[tipo as keyof typeof cores] || "";
  };

  const getStatusLabel = (status: string) => {
    const statusMap = {
      planejado: "Planejado",
      em_andamento: "Em Andamento",
      concluido: "Concluído",
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusBadgeColor = (status: string) => {
    const cores = {
      planejado: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      em_andamento: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      concluido: "bg-green-500/10 text-green-500 border-green-500/20",
    };
    return cores[status as keyof typeof cores] || "";
  };

  // Filtrar por termo de busca
  const treinamentosFiltrados = treinamentos.filter((treinamento) =>
    treinamento.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">
            Treinamentos e Desenvolvimento
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie programas de onboarding, capacitação técnica e treinamentos comportamentais
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-novo-treinamento">
              <Plus className="h-4 w-4 mr-2" />
              Novo Treinamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Treinamento</DialogTitle>
              <DialogDescription>
                Preencha os dados do programa de treinamento
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
                        <Input {...field} placeholder="Ex: Onboarding Novos Funcionários" data-testid="input-titulo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Treinamento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-tipo">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="onboarding" data-testid="option-onboarding">Onboarding</SelectItem>
                          <SelectItem value="tecnico" data-testid="option-tecnico">Capacitação Técnica</SelectItem>
                          <SelectItem value="comportamental" data-testid="option-comportamental">Treinamento Comportamental / Soft Skills</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gestorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gestor Responsável</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger data-testid="select-gestor">
                            <SelectValue placeholder="Selecione o gestor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {gestores.map((gestor) => (
                            <SelectItem key={gestor.id} value={gestor.id.toString()} data-testid={`option-gestor-${gestor.id}`}>
                              {gestor.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        <FormLabel>Data de Término</FormLabel>
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
                  name="cargaHoraria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carga Horária (horas)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min="1" data-testid="input-carga-horaria" />
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
                          placeholder="Descreva os objetivos e conteúdo do treinamento..."
                          className="min-h-[100px]"
                          data-testid="textarea-descricao"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setDialogOpen(false)}
                    data-testid="button-cancelar"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending} data-testid="button-salvar">
                    {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Criar Treinamento
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Treinamentos Cadastrados</CardTitle>
          <CardDescription>
            Lista de todos os programas de treinamento e desenvolvimento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar treinamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-buscar-treinamento"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">Carregando...</div>
          ) : treinamentosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-16 w-16 text-muted-foreground mb-4 mx-auto" />
              <p className="text-lg text-muted-foreground" data-testid="text-empty-state">
                {treinamentos.length === 0 
                  ? "Em Desenvolvimento"
                  : "Nenhum treinamento encontrado com esse termo de busca"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Gestor</TableHead>
                    <TableHead>Carga Horária</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {treinamentosFiltrados.map((treinamento) => (
                    <TableRow key={treinamento.id} data-testid={`row-treinamento-${treinamento.id}`}>
                      <TableCell>{treinamento.id}</TableCell>
                      <TableCell className="font-medium">{treinamento.titulo}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getTipoBadgeColor(treinamento.tipo)} data-testid={`badge-tipo-${treinamento.id}`}>
                          {getTipoLabel(treinamento.tipo)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(treinamento.dataInicio), "dd/MM/yyyy", { locale: ptBR })} -{" "}
                        {format(new Date(treinamento.dataFim), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>{treinamento.gestorNome || "N/A"}</TableCell>
                      <TableCell>{treinamento.cargaHoraria ? `${treinamento.cargaHoraria}h` : "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadgeColor(treinamento.status)} data-testid={`badge-status-${treinamento.id}`}>
                          {getStatusLabel(treinamento.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/treinamentos/${treinamento.id}`}>
                          <Button size="sm" variant="outline" data-testid={`button-detalhes-${treinamento.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
