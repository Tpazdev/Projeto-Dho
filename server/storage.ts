import {
  empresas,
  gestores,
  funcionarios,
  desligamentos,
  documentosFuncionario,
  documentosGestor,
  type Empresa,
  type InsertEmpresa,
  type Gestor,
  type InsertGestor,
  type Funcionario,
  type InsertFuncionario,
  type Desligamento,
  type InsertDesligamento,
  type DocumentoFuncionario,
  type InsertDocumentoFuncionario,
  type DocumentoGestor,
  type InsertDocumentoGestor,
} from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  createEmpresa(empresa: InsertEmpresa): Promise<Empresa>;
  getEmpresas(): Promise<Empresa[]>;
  getEmpresa(id: number): Promise<Empresa | undefined>;

  createGestor(gestor: InsertGestor): Promise<Gestor>;
  getGestores(): Promise<Gestor[]>;
  getGestor(id: number): Promise<Gestor | undefined>;

  createFuncionario(funcionario: InsertFuncionario): Promise<Funcionario>;
  getFuncionarios(): Promise<Funcionario[]>;
  getFuncionario(id: number): Promise<Funcionario | undefined>;

  createDesligamento(desligamento: InsertDesligamento): Promise<Desligamento>;
  getDesligamentos(): Promise<Desligamento[]>;
  getDesligamento(id: number): Promise<Desligamento | undefined>;

  getDesligamentosComDetalhes(): Promise<any[]>;
  getDesligamentosPorGestor(): Promise<{ labels: string[]; data: number[] }>;
  getDesligamentosPorEmpresa(): Promise<{ labels: string[]; data: number[] }>;

  createDocumentoFuncionario(documento: InsertDocumentoFuncionario): Promise<DocumentoFuncionario>;
  getDocumentosByFuncionario(funcionarioId: number): Promise<DocumentoFuncionario[]>;
  deleteDocumentoFuncionario(id: number): Promise<void>;

  createDocumentoGestor(documento: InsertDocumentoGestor): Promise<DocumentoGestor>;
  getDocumentosByGestor(gestorId: number): Promise<DocumentoGestor[]>;
  deleteDocumentoGestor(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createEmpresa(data: InsertEmpresa): Promise<Empresa> {
    const [empresa] = await db
      .insert(empresas)
      .values(data)
      .returning();
    return empresa;
  }

  async getEmpresas(): Promise<Empresa[]> {
    return await db.select().from(empresas);
  }

  async getEmpresa(id: number): Promise<Empresa | undefined> {
    const [empresa] = await db.select().from(empresas).where(eq(empresas.id, id));
    return empresa || undefined;
  }

  async createGestor(data: InsertGestor): Promise<Gestor> {
    const [gestor] = await db
      .insert(gestores)
      .values(data)
      .returning();
    return gestor;
  }

  async getGestores(): Promise<Gestor[]> {
    return await db.select().from(gestores);
  }

  async getGestor(id: number): Promise<Gestor | undefined> {
    const [gestor] = await db.select().from(gestores).where(eq(gestores.id, id));
    return gestor || undefined;
  }

  async createFuncionario(data: InsertFuncionario): Promise<Funcionario> {
    const [funcionario] = await db
      .insert(funcionarios)
      .values(data)
      .returning();
    return funcionario;
  }

  async getFuncionarios(): Promise<Funcionario[]> {
    return await db.select().from(funcionarios);
  }

  async getFuncionario(id: number): Promise<Funcionario | undefined> {
    const [funcionario] = await db.select().from(funcionarios).where(eq(funcionarios.id, id));
    return funcionario || undefined;
  }

  async createDesligamento(data: InsertDesligamento): Promise<Desligamento> {
    const [desligamento] = await db
      .insert(desligamentos)
      .values(data)
      .returning();
    return desligamento;
  }

  async getDesligamentos(): Promise<Desligamento[]> {
    return await db.select().from(desligamentos);
  }

  async getDesligamento(id: number): Promise<Desligamento | undefined> {
    const [desligamento] = await db.select().from(desligamentos).where(eq(desligamentos.id, id));
    return desligamento || undefined;
  }

  async getDesligamentosComDetalhes(): Promise<any[]> {
    const result = await db
      .select({
        id: desligamentos.id,
        dataDesligamento: desligamentos.dataDesligamento,
        motivo: desligamentos.motivo,
        funcionarioId: desligamentos.funcionarioId,
        funcionarioNome: funcionarios.nome,
        cargo: funcionarios.cargo,
        gestorId: desligamentos.gestorId,
        gestorNome: gestores.nome,
        empresaId: desligamentos.empresaId,
        empresaNome: empresas.nome,
      })
      .from(desligamentos)
      .innerJoin(funcionarios, eq(desligamentos.funcionarioId, funcionarios.id))
      .innerJoin(gestores, eq(desligamentos.gestorId, gestores.id))
      .innerJoin(empresas, eq(desligamentos.empresaId, empresas.id))
      .orderBy(desligamentos.dataDesligamento);

    return result;
  }

  async getDesligamentosPorGestor(): Promise<{ labels: string[]; data: number[] }> {
    const result = await db
      .select({
        gestorNome: gestores.nome,
        count: sql<number>`count(*)::int`,
      })
      .from(desligamentos)
      .innerJoin(gestores, eq(desligamentos.gestorId, gestores.id))
      .groupBy(gestores.id, gestores.nome)
      .orderBy(gestores.nome);

    return {
      labels: result.map((r) => r.gestorNome),
      data: result.map((r) => r.count),
    };
  }

  async getDesligamentosPorEmpresa(): Promise<{ labels: string[]; data: number[] }> {
    const result = await db
      .select({
        empresaNome: empresas.nome,
        count: sql<number>`count(*)::int`,
      })
      .from(desligamentos)
      .innerJoin(empresas, eq(desligamentos.empresaId, empresas.id))
      .groupBy(empresas.id, empresas.nome)
      .orderBy(empresas.nome);

    return {
      labels: result.map((r) => r.empresaNome),
      data: result.map((r) => r.count),
    };
  }

  async createDocumentoFuncionario(data: InsertDocumentoFuncionario): Promise<DocumentoFuncionario> {
    const [documento] = await db
      .insert(documentosFuncionario)
      .values(data)
      .returning();
    return documento;
  }

  async getDocumentosByFuncionario(funcionarioId: number): Promise<DocumentoFuncionario[]> {
    return await db
      .select()
      .from(documentosFuncionario)
      .where(eq(documentosFuncionario.funcionarioId, funcionarioId));
  }

  async deleteDocumentoFuncionario(id: number): Promise<void> {
    await db.delete(documentosFuncionario).where(eq(documentosFuncionario.id, id));
  }

  async createDocumentoGestor(data: InsertDocumentoGestor): Promise<DocumentoGestor> {
    const [documento] = await db
      .insert(documentosGestor)
      .values(data)
      .returning();
    return documento;
  }

  async getDocumentosByGestor(gestorId: number): Promise<DocumentoGestor[]> {
    return await db
      .select()
      .from(documentosGestor)
      .where(eq(documentosGestor.gestorId, gestorId));
  }

  async deleteDocumentoGestor(id: number): Promise<void> {
    await db.delete(documentosGestor).where(eq(documentosGestor.id, id));
  }
}

export const storage = new DatabaseStorage();
