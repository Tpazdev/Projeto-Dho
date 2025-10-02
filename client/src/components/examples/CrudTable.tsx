import { CrudTable } from "../CrudTable";

export default function CrudTableExample() {
  const mockData = [
    { id: 1, nome: "Tech Solutions" },
    { id: 2, nome: "Inovação Corp" },
    { id: 3, nome: "Digital Ventures" },
  ];

  const columns = [
    { header: "ID", accessor: "id" as const },
    { header: "Nome", accessor: "nome" as const },
  ];

  const handleAdd = () => {
    console.log("Add button clicked");
  };

  return (
    <div className="p-6">
      <CrudTable
        title="Empresas"
        data={mockData}
        columns={columns}
        onAddClick={handleAdd}
      />
    </div>
  );
}
