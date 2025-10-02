import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDesligamentoSchema } from "@shared/schema";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = insertDesligamentoSchema.extend({
  dataDesligamento: z.string().min(1, "Data é obrigatória"),
});

interface DesligamentoFormProps {
  empresas: Array<{ id: number; nome: string }>;
  gestores: Array<{ id: number; nome: string; empresaId: number }>;
  funcionarios: Array<{ id: number; nome: string; cargo: string; gestorId: number }>;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  isLoading?: boolean;
}

export function DesligamentoForm({
  empresas,
  gestores,
  funcionarios,
  onSubmit,
  isLoading = false,
}: DesligamentoFormProps) {
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<number | null>(null);
  const [selectedGestorId, setSelectedGestorId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataDesligamento: "",
      motivo: "",
      funcionarioId: 0,
      empresaId: 0,
      gestorId: 0,
    },
  });

  const filteredGestores = selectedEmpresaId
    ? gestores.filter((g) => g.empresaId === selectedEmpresaId)
    : gestores;

  const filteredFuncionarios = selectedGestorId
    ? funcionarios.filter((f) => f.gestorId === selectedGestorId)
    : funcionarios;

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted with data:", data);
    onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Novo Desligamento</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="empresaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa *</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const id = parseInt(value);
                        field.onChange(id);
                        setSelectedEmpresaId(id);
                        setSelectedGestorId(null);
                        form.setValue("gestorId", 0);
                        form.setValue("funcionarioId", 0);
                      }}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-empresa">
                          <SelectValue placeholder="Selecione uma empresa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {empresas.map((empresa) => (
                          <SelectItem key={empresa.id} value={empresa.id.toString()}>
                            {empresa.nome}
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
                    <FormLabel>Gestor *</FormLabel>
                    <Select
                      disabled={!selectedEmpresaId}
                      onValueChange={(value) => {
                        const id = parseInt(value);
                        field.onChange(id);
                        setSelectedGestorId(id);
                        form.setValue("funcionarioId", 0);
                      }}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-gestor">
                          <SelectValue placeholder="Selecione um gestor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredGestores.map((gestor) => (
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

              <FormField
                control={form.control}
                name="funcionarioId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funcionário *</FormLabel>
                    <Select
                      disabled={!selectedGestorId}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-funcionario">
                          <SelectValue placeholder="Selecione um funcionário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredFuncionarios.map((funcionario) => (
                          <SelectItem key={funcionario.id} value={funcionario.id.toString()}>
                            {funcionario.nome} - {funcionario.cargo}
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
                name="dataDesligamento"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data do Desligamento *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            data-testid="button-date-picker"
                          >
                            {field.value ? (
                              format(new Date(field.value), "dd/MM/yyyy")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(format(date, "yyyy-MM-dd"));
                            }
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="motivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o motivo do desligamento..."
                      className="resize-none"
                      rows={4}
                      data-testid="input-motivo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                data-testid="button-submit-desligamento"
              >
                {isLoading ? "Salvando..." : "Registrar Desligamento"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
