import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface CrudTableProps<T extends { id: number }> {
  title: string;
  data: T[];
  columns: Column<T>[];
  onAddClick: () => void;
  emptyMessage?: string;
}

export function CrudTable<T extends { id: number }>({
  title,
  data,
  columns,
  onAddClick,
  emptyMessage = "Nenhum registro encontrado",
}: CrudTableProps<T>) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
        <CardTitle>{title}</CardTitle>
        <Button onClick={onAddClick} data-testid={`button-add-${title.toLowerCase()}`}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={index}>{column.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={item.id} data-testid={`row-${title.toLowerCase()}-${item.id}`}>
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex}>
                        {typeof column.accessor === "function"
                          ? column.accessor(item)
                          : String(item[column.accessor])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
