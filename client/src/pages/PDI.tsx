import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertPdiSchema, type Pdi } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Plus, Calendar, User, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "wouter";

const formSchema = insertPdiSchema.extend({
  funcionarioId: z.number().min(1, "Funcionário é obrigatório"),
  gestorId: z.number().min(1, "Gestor é obrigatório"),
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
  dataFim: z.string().min(1, "Data de fim é obrigatória"),
}).required();

const statusLabels = {
  em_elaboracao: "Em Elaboração",
  em_andamento: "Em Andamento",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

const statusColors = {
  em_elaboracao: "bg-yellow-500",
  em_andamento: "bg-blue-500",
  concluido: "bg-green-500",
  cancelado: "bg-gray-500",
};

export default function PDI() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { data: pdis = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/pdis"],
  });

  const { data: funcionarios = [] } = useQuery<any[]>({
    queryKey: ["/api/funcionarios"],
  });

  const { data: gestores = [] } = useQuery<any[]>({
    queryKey: ["/api/gestores"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataInicio: "",
      dataFim: "",
      status: "em_elaboracao",
      observacoes: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await apiRequest("POST", "/api/pdis", data);

      await queryClient.invalidateQueries({ queryKey: ["/api/pdis"] });
      toast({
        title: "Sucesso",
        description: "PDI criado com sucesso",
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar PDI",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-page-title">PDI - Plano de Desenvolvimento Individual</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os planos de desenvolvimento individual dos funcionários
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-novo-pdi">
                <Plus className="w-4 h-4 mr-2" />
                Novo PDI
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Novo PDI</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="funcionarioId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funcionário</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-funcionario">
                              <SelectValue placeholder="Selecione o funcionário" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {funcionarios.map((func: any) => (
                              <SelectItem key={func.id} value={func.id.toString()}>
                                {func.nome} {func.cargo && `- ${func.cargo}`}
                              </SelectItem>
                            ))}
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
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-gestor">
                              <SelectValue placeholder="Selecione o gestor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {gestores.map((gestor: any) => (
                              <SelectItem key={gestor.id} value={gestor.id.toString()}>
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
                          <FormLabel>Data Início</FormLabel>
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
                          <FormLabel>Data Fim</FormLabel>
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-status">
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="em_elaboracao">Em Elaboração</SelectItem>
                            <SelectItem value="em_andamento">Em Andamento</SelectItem>
                            <SelectItem value="concluido">Concluído</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="observacoes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Observações sobre o PDI"
                            value={field.value || ""}
                            data-testid="textarea-observacoes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setOpen(false);
                        form.reset();
                      }}
                      data-testid="button-cancelar"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" data-testid="button-salvar">
                      Criar PDI
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {pdis.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhum PDI cadastrado ainda. Crie o primeiro PDI para começar.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pdis.map((pdi: any) => (
              <Link key={pdi.id} href={`/pdi/${pdi.id}`}>
                <Card
                  className="hover-elevate active-elevate-2 cursor-pointer transition-all h-full"
                  data-testid={`card-pdi-${pdi.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg" data-testid={`text-funcionario-${pdi.id}`}>
                          {pdi.funcionarioNome}
                        </CardTitle>
                        {pdi.funcionarioCargo && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {pdi.funcionarioCargo}
                          </p>
                        )}
                      </div>
                      <Badge
                        className={statusColors[pdi.status as keyof typeof statusColors]}
                        data-testid={`badge-status-${pdi.id}`}
                      >
                        {statusLabels[pdi.status as keyof typeof statusLabels]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>Gestor: {pdi.gestorNome}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(pdi.dataInicio), "dd/MM/yyyy", { locale: ptBR })} -{" "}
                        {format(new Date(pdi.dataFim), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
