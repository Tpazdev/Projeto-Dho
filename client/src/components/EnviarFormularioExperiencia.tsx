import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Send, Copy, ExternalLink, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnviarFormularioExperienciaProps {
  formularioId: number;
  gestorNome: string;
  funcionarioNome: string;
  periodo: string;
}

const FORMULARIO_EXPERIENCIA_URL = "https://forms.office.com/pages/responsepage.aspx?id=fKhs6GEk4keMILRXyHexKD9hUGoTJTBAh3e6AfxsqZRUREcxQzk3SUJNMkFYMVVKWE04R1IzRjJNUSQlQCN0PWcu&route=shorturl";

export function EnviarFormularioExperiencia({
  formularioId,
  gestorNome,
  funcionarioNome,
  periodo,
}: EnviarFormularioExperienciaProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const periodoTexto = periodo === "1" ? "01° Período (30 dias)" : "02° Período (60 dias)";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(FORMULARIO_EXPERIENCIA_URL);
      setCopied(true);
      toast({
        title: "Link copiado!",
        description: "O link do formulário foi copiado para a área de transferência.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link.",
        variant: "destructive",
      });
    }
  };

  const handleOpenForm = () => {
    window.open(FORMULARIO_EXPERIENCIA_URL, "_blank");
    toast({
      title: "Formulário aberto",
      description: "O formulário foi aberto em uma nova aba.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          data-testid={`button-enviar-formulario-${formularioId}`}
        >
          <Send className="h-4 w-4 mr-2" />
          Enviar Formulário ao Gestor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar Formulário de Avaliação de Experiência</DialogTitle>
          <DialogDescription className="space-y-2 pt-2">
            <p>
              <strong>Gestor:</strong> {gestorNome}
            </p>
            <p>
              <strong>Funcionário:</strong> {funcionarioNome}
            </p>
            <p>
              <strong>Período:</strong> {periodoTexto}
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm text-muted-foreground mb-3">
              Envie o link abaixo para o gestor preencher a avaliação de experiência:
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-background p-2 rounded border break-all">
                {FORMULARIO_EXPERIENCIA_URL}
              </code>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleCopyLink}
            data-testid="button-copy-link"
            className="w-full sm:w-auto"
          >
            {copied ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {copied ? "Copiado!" : "Copiar Link"}
          </Button>
          <Button
            onClick={handleOpenForm}
            data-testid="button-open-form"
            className="w-full sm:w-auto"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir Formulário
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
