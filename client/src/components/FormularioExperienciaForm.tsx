import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type FormularioExperienciaItem = {
  id: number;
  funcionarioId: number;
  funcionarioNome: string;
  gestorId: number;
  gestorNome: string;
  dataLimite: string;
  status: "pendente" | "preenchido" | "aprovado" | "reprovado";
  dataPreenchimento?: string | null;
  desempenho?: number | null;
  pontosFortes?: string | null;
  pontosMelhoria?: string | null;
  recomendacao?: string | null;
  observacoes?: string | null;
};

const formularioSchema = z.object({
  desempenho: z.coerce.number().min(1, "Obrigatório").max(10, "Nota máxima é 10"),
  pontosFortes: z.string().min(1, "Campo obrigatório"),
  pontosMelhoria: z.string().min(1, "Campo obrigatório"),
  recomendacao: z.enum(["aprovado", "reprovado"]),
  observacoes: z.string().optional(),
});

type FormularioFormData = z.infer<typeof formularioSchema>;

interface FormularioExperienciaFormProps {
  formulario: FormularioExperienciaItem;
  onClose: () => void;
}

export function FormularioExperienciaForm({ formulario, onClose }: FormularioExperienciaFormProps) {
  const { toast } = useToast();
  const isPendente = formulario.status === "pendente";

  const form = useForm<FormularioFormData>({
    resolver: zodResolver(formularioSchema),
    defaultValues: {
      desempenho: formulario.desempenho || 5,
      pontosFortes: formulario.pontosFortes || "",
      pontosMelhoria: formulario.pontosMelhoria || "",
      recomendacao: (formulario.recomendacao as "aprovado" | "reprovado") || "aprovado",
      observacoes: formulario.observacoes || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormularioFormData) => {
      const payload = {
        ...data,
        status: "preenchido",
        dataPreenchimento: new Date().toISOString().split("T")[0],
      };
      return await apiRequest("PATCH", `/api/formularios-experiencia/${formulario.id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/formularios-experiencia"] });
      toast({
        title: "Sucesso!",
        description: "Avaliação salva com sucesso",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a avaliação",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormularioFormData) => {
    updateMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="desempenho"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desempenho (0-10)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  {...field}
                  disabled={!isPendente}
                  data-testid="input-desempenho"
                />
              </FormControl>
              <FormDescription>Avalie o desempenho geral do funcionário de 0 a 10</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pontosFortes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pontos Fortes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Descreva os principais pontos fortes do funcionário..."
                  className="min-h-[100px]"
                  disabled={!isPendente}
                  data-testid="textarea-pontos-fortes"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pontosMelhoria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pontos de Melhoria</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Descreva os pontos que precisam de melhoria..."
                  className="min-h-[100px]"
                  disabled={!isPendente}
                  data-testid="textarea-pontos-melhoria"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recomendacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recomendação Final</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isPendente}>
                <FormControl>
                  <SelectTrigger data-testid="select-recomendacao">
                    <SelectValue placeholder="Selecione a recomendação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="aprovado" data-testid="option-aprovado">
                    Aprovado - Efetivar Funcionário
                  </SelectItem>
                  <SelectItem value="reprovado" data-testid="option-reprovado">
                    Reprovado - Encerrar Contrato
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Sua recomendação sobre a efetivação do funcionário</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações Adicionais (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Adicione observações adicionais se necessário..."
                  className="min-h-[100px]"
                  disabled={!isPendente}
                  data-testid="textarea-observacoes"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancelar">
            {isPendente ? "Cancelar" : "Fechar"}
          </Button>
          {isPendente && (
            <Button type="submit" disabled={updateMutation.isPending} data-testid="button-salvar">
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Avaliação
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
