import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmpresaSchema, insertGestorSchema, insertFuncionarioSchema, insertDesligamentoSchema, insertDocumentoFuncionarioSchema, insertDocumentoGestorSchema, insertFormularioExperienciaSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/empresas", async (req, res) => {
    try {
      const empresas = await storage.getEmpresas();
      res.json(empresas);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar empresas" });
    }
  });

  app.post("/api/empresas", async (req, res) => {
    try {
      const validated = insertEmpresaSchema.parse(req.body);
      const empresa = await storage.createEmpresa(validated);
      res.json(empresa);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.get("/api/gestores", async (req, res) => {
    try {
      const gestores = await storage.getGestores();
      res.json(gestores);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar gestores" });
    }
  });

  app.post("/api/gestores", async (req, res) => {
    try {
      const validated = insertGestorSchema.parse(req.body);
      const gestor = await storage.createGestor(validated);
      res.json(gestor);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.get("/api/funcionarios", async (req, res) => {
    try {
      const funcionarios = await storage.getFuncionarios();
      res.json(funcionarios);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar funcionários" });
    }
  });

  app.post("/api/funcionarios", async (req, res) => {
    try {
      const validated = insertFuncionarioSchema.parse(req.body);
      const funcionario = await storage.createFuncionario(validated);
      res.json(funcionario);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.get("/api/desligamentos", async (req, res) => {
    try {
      const desligamentos = await storage.getDesligamentosComDetalhes();
      res.json(desligamentos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar desligamentos" });
    }
  });

  app.post("/api/desligamentos", async (req, res) => {
    try {
      const validated = insertDesligamentoSchema.parse(req.body);
      const desligamento = await storage.createDesligamento(validated);
      res.json(desligamento);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.get("/api/dados/desligamentos_por_gestor", async (req, res) => {
    try {
      const data = await storage.getDesligamentosPorGestor();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar dados" });
    }
  });

  app.get("/api/dados/desligamentos_por_empresa", async (req, res) => {
    try {
      const data = await storage.getDesligamentosPorEmpresa();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar dados" });
    }
  });

  app.get("/api/funcionarios/:id/documentos", async (req, res) => {
    try {
      const funcionarioId = parseInt(req.params.id);
      const documentos = await storage.getDocumentosByFuncionario(funcionarioId);
      res.json(documentos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar documentos" });
    }
  });

  app.post("/api/funcionarios/:id/documentos", async (req, res) => {
    try {
      const funcionarioId = parseInt(req.params.id);
      const validated = insertDocumentoFuncionarioSchema.parse({
        ...req.body,
        funcionarioId,
      });
      const documento = await storage.createDocumentoFuncionario(validated);
      res.json(documento);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.delete("/api/documentos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteDocumentoFuncionario(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar documento" });
    }
  });

  app.get("/api/gestores/:id/documentos", async (req, res) => {
    try {
      const gestorId = parseInt(req.params.id);
      const documentos = await storage.getDocumentosByGestor(gestorId);
      res.json(documentos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar documentos" });
    }
  });

  app.post("/api/gestores/:id/documentos", async (req, res) => {
    try {
      const gestorId = parseInt(req.params.id);
      const validated = insertDocumentoGestorSchema.parse({
        ...req.body,
        gestorId,
      });
      const documento = await storage.createDocumentoGestor(validated);
      res.json(documento);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.delete("/api/documentos-gestor/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteDocumentoGestor(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar documento" });
    }
  });

  app.get("/api/formularios-experiencia", async (req, res) => {
    try {
      const formularios = await storage.getFormulariosExperiencia();
      res.json(formularios);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar formulários" });
    }
  });

  app.get("/api/formularios-experiencia/pendentes", async (req, res) => {
    try {
      const formularios = await storage.getFormulariosExperienciaPendentes();
      res.json(formularios);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar formulários pendentes" });
    }
  });

  app.get("/api/formularios-experiencia/gestor/:gestorId", async (req, res) => {
    try {
      const gestorId = parseInt(req.params.gestorId);
      const formularios = await storage.getFormulariosExperienciaByGestor(gestorId);
      res.json(formularios);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar formulários do gestor" });
    }
  });

  app.get("/api/formularios-experiencia/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const formulario = await storage.getFormularioExperiencia(id);
      if (!formulario) {
        return res.status(404).json({ error: "Formulário não encontrado" });
      }
      res.json(formulario);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar formulário" });
    }
  });

  app.post("/api/formularios-experiencia", async (req, res) => {
    try {
      const validated = insertFormularioExperienciaSchema.parse(req.body);
      const formulario = await storage.createFormularioExperiencia(validated);
      res.json(formulario);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.patch("/api/formularios-experiencia/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const formulario = await storage.updateFormularioExperiencia(id, req.body);
      res.json(formulario);
    } catch (error) {
      res.status(400).json({ error: "Erro ao atualizar formulário" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
