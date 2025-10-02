import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export interface DesligamentoData {
  id: number;
  funcionarioNome: string;
  cargo: string;
  gestorNome: string;
  empresaNome: string;
  dataDesligamento: string;
}

interface DesligamentosTableProps {
  desligamentos: DesligamentoData[];
}

export function DesligamentosTable({ desligamentos }: DesligamentosTableProps) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Gestor</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Data do Desligamento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {desligamentos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhum desligamento registrado
                </TableCell>
              </TableRow>
            ) : (
              desligamentos.map((desligamento) => (
                <TableRow key={desligamento.id} data-testid={`row-desligamento-${desligamento.id}`}>
                  <TableCell className="font-medium" data-testid={`text-funcionario-${desligamento.id}`}>
                    {desligamento.funcionarioNome}
                  </TableCell>
                  <TableCell data-testid={`text-cargo-${desligamento.id}`}>
                    {desligamento.cargo}
                  </TableCell>
                  <TableCell data-testid={`text-gestor-${desligamento.id}`}>
                    {desligamento.gestorNome}
                  </TableCell>
                  <TableCell data-testid={`text-empresa-${desligamento.id}`}>
                    {desligamento.empresaNome}
                  </TableCell>
                  <TableCell data-testid={`text-data-${desligamento.id}`}>
                    {format(new Date(desligamento.dataDesligamento), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
