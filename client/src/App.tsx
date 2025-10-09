import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import NovoDesligamento from "@/pages/NovoDesligamento";
import DesligamentosFuncionario from "@/pages/DesligamentosFuncionario";
import DesligamentosGestor from "@/pages/DesligamentosGestor";
import Empresas from "@/pages/Empresas";
import Gestores from "@/pages/Gestores";
import Funcionarios from "@/pages/Funcionarios";
import FormulariosExperiencia from "@/pages/FormulariosExperiencia";
import Ambiencia from "@/pages/Ambiencia";
import AmbienciaPerguntas from "@/pages/AmbienciaPerguntas";
import AmbienciaResponder from "@/pages/AmbienciaResponder";
import AmbienciaAnalise from "@/pages/AmbienciaAnalise";
import Treinamentos from "@/pages/Treinamentos";
import TreinamentoDetalhes from "@/pages/TreinamentoDetalhes";
import PDI from "@/pages/PDI";
import PDIDetalhes from "@/pages/PDIDetalhes";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/desligamento/novo" component={NovoDesligamento} />
      <Route path="/desligamentos/funcionario" component={DesligamentosFuncionario} />
      <Route path="/desligamentos/gestor" component={DesligamentosGestor} />
      <Route path="/empresas" component={Empresas} />
      <Route path="/gestores" component={Gestores} />
      <Route path="/funcionarios" component={Funcionarios} />
      <Route path="/formularios-experiencia" component={FormulariosExperiencia} />
      <Route path="/ambiencia" component={Ambiencia} />
      <Route path="/ambiencia/:id/perguntas" component={AmbienciaPerguntas} />
      <Route path="/ambiencia/:id/analise" component={AmbienciaAnalise} />
      <Route path="/ambiencia/responder" component={AmbienciaResponder} />
      <Route path="/treinamentos" component={Treinamentos} />
      <Route path="/treinamentos/:id" component={TreinamentoDetalhes} />
      <Route path="/pdi" component={PDI} />
      <Route path="/pdi/:id" component={PDIDetalhes} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
                    <h2 className="text-xl font-semibold">Sistema de Gestão de Desligamentos</h2>
                  </div>
                  <ThemeToggle />
                </header>
                <main className="flex-1 overflow-auto p-6">
                  <div className="max-w-7xl mx-auto">
                    <Router />
                  </div>
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
