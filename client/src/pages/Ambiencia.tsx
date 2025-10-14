import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function Ambiencia() {
  return (
    <div className="h-full overflow-auto p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold" data-testid="text-page-title">
            Pesquisas de Clima Organizacional
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie pesquisas de clima e analise o ambiente de trabalho
          </p>
        </div>

        <Card>
          <CardContent className="py-16 text-center">
            <Construction className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold mb-2" data-testid="text-em-construcao">
              Em Construção
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
