import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Trash2 } from "lucide-react";

interface FuncionarioDetalhesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  funcionario: {
    id: number;
    nome: string;
    cargo?: string;
    gestorNome?: string;
  } | null;
}

const tiposDocumento = [
  { value: "CPF", label: "CPF" },
  { value: "RG", label: "RG" },
  { value: "CNH", label: "CNH" },
  { value: "CTPS", label: "CTPS" },
  { value: "Título de Eleitor", label: "Título de Eleitor" },
  { value: "PIS/PASEP", label: "PIS/PASEP" },
  { value: "Certificado Reservista", label: "Certificado Reservista" },
  { value: "Outro", label: "Outro" },
];

export function FuncionarioDetalhesDialog({
  open,
  onOpenChange,
  funcionario,
}: FuncionarioDetalhesDialogProps) {
  const { toast } = useToast();
  const [showAddDocumento, setShowAddDocumento] = useState(false);
  const [novoDocumento, setNovoDocumento] = useState({
    tipoDocumento: "",
    numeroDocumento: "",
    observacoes: "",
  });

  const { data: documentos = [], isLoading } = useQuery({
    queryKey: ["/api/funcionarios", funcionario?.id, "documentos"],
    enabled: !!funcionario?.id && open,
  });

  const addDocumentoMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest(
        "POST",
        `/api/funcionarios/${funcionario?.id}/documentos`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/funcionarios", funcionario?.id, "documentos"],
      });
      toast({
        title: "Documento adicionado",
        description: "O documento foi adicionado com sucesso.",
      });
      setNovoDocumento({ tipoDocumento: "", numeroDocumento: "", observacoes: "" });
      setShowAddDocumento(false);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao adicionar documento.",
        variant: "destructive",
      });
    },
  });

  const deleteDocumentoMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/documentos/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/funcionarios", funcionario?.id, "documentos"],
      });
      toast({
        title: "Documento removido",
        description: "O documento foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao remover documento.",
        variant: "destructive",
      });
    },
  });

  const handleAddDocumento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoDocumento.tipoDocumento || !novoDocumento.numeroDocumento) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    addDocumentoMutation.mutate(novoDocumento);
  };

  if (!funcionario) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" data-testid="dialog-funcionario-detalhes">
        <DialogHeader>
          <DialogTitle>Detalhes do Funcionário</DialogTitle>
          <DialogDescription>
            Visualize e gerencie os documentos do funcionário
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium">Nome:</span> {funcionario.nome}
              </div>
              {funcionario.cargo && (
                <div>
                  <span className="font-medium">Cargo:</span> {funcionario.cargo}
                </div>
              )}
              {funcionario.gestorNome && (
                <div>
                  <span className="font-medium">Gestor:</span> {funcionario.gestorNome}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
              <CardTitle className="text-lg">Documentos</CardTitle>
              <Button
                onClick={() => setShowAddDocumento(!showAddDocumento)}
                size="sm"
                data-testid="button-toggle-add-documento"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Documento
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {showAddDocumento && (
                <form onSubmit={handleAddDocumento} className="space-y-4 p-4 border rounded-md">
                  <div className="space-y-2">
                    <Label htmlFor="tipoDocumento">
                      Tipo de Documento <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={novoDocumento.tipoDocumento}
                      onValueChange={(value) =>
                        setNovoDocumento({ ...novoDocumento, tipoDocumento: value })
                      }
                      required
                    >
                      <SelectTrigger data-testid="select-tipo-documento">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposDocumento.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numeroDocumento">
                      Número do Documento <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="numeroDocumento"
                      value={novoDocumento.numeroDocumento}
                      onChange={(e) =>
                        setNovoDocumento({ ...novoDocumento, numeroDocumento: e.target.value })
                      }
                      placeholder="Digite o número do documento"
                      required
                      data-testid="input-numero-documento"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={novoDocumento.observacoes}
                      onChange={(e) =>
                        setNovoDocumento({ ...novoDocumento, observacoes: e.target.value })
                      }
                      placeholder="Observações adicionais (opcional)"
                      data-testid="input-observacoes"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddDocumento(false);
                        setNovoDocumento({ tipoDocumento: "", numeroDocumento: "", observacoes: "" });
                      }}
                      data-testid="button-cancel-documento"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={addDocumentoMutation.isPending}
                      data-testid="button-submit-documento"
                    >
                      Adicionar
                    </Button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Número</TableHead>
                      <TableHead>Observações</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          Carregando...
                        </TableCell>
                      </TableRow>
                    ) : documentos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          Nenhum documento cadastrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      documentos.map((doc: any) => (
                        <TableRow key={doc.id} data-testid={`row-documento-${doc.id}`}>
                          <TableCell>{doc.tipoDocumento}</TableCell>
                          <TableCell>{doc.numeroDocumento}</TableCell>
                          <TableCell>{doc.observacoes || "-"}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteDocumentoMutation.mutate(doc.id)}
                              disabled={deleteDocumentoMutation.isPending}
                              data-testid={`button-delete-documento-${doc.id}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
