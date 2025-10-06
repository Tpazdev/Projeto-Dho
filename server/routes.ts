import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmpresaSchema, insertGestorSchema, insertFuncionarioSchema, insertDesligamentoSchema } from "@shared/schema";

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

  const httpServer = createServer(app);

  return httpServer;
}
