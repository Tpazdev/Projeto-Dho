import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const empresas = pgTable("empresas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: text("nome").notNull().unique(),
});

export const gestores = pgTable("gestores", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: text("nome").notNull(),
  empresaId: integer("empresa_id").notNull().references(() => empresas.id),
});

export const funcionarios = pgTable("funcionarios", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: text("nome").notNull(),
  cargo: text("cargo"),
  gestorId: integer("gestor_id").notNull().references(() => gestores.id),
  dataAdmissao: date("data_admissao"),
});

export const desligamentos = pgTable("desligamentos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  dataDesligamento: date("data_desligamento").notNull(),
  motivo: text("motivo"),
  funcionarioId: integer("funcionario_id").notNull().references(() => funcionarios.id),
  empresaId: integer("empresa_id").notNull().references(() => empresas.id),
  gestorId: integer("gestor_id").notNull().references(() => gestores.id),
});

export const documentosFuncionario = pgTable("documentos_funcionario", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  funcionarioId: integer("funcionario_id").notNull().references(() => funcionarios.id),
  tipoDocumento: text("tipo_documento").notNull(),
  numeroDocumento: text("numero_documento").notNull(),
  observacoes: text("observacoes"),
});

export const documentosGestor = pgTable("documentos_gestor", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  gestorId: integer("gestor_id").notNull().references(() => gestores.id),
  tipoDocumento: text("tipo_documento").notNull(),
  numeroDocumento: text("numero_documento").notNull(),
  observacoes: text("observacoes"),
});

export const formulariosExperiencia = pgTable("formularios_experiencia", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  funcionarioId: integer("funcionario_id").notNull().references(() => funcionarios.id),
  gestorId: integer("gestor_id").notNull().references(() => gestores.id),
  dataLimite: date("data_limite").notNull(),
  status: text("status").notNull().default("pendente"),
  dataPreenchimento: date("data_preenchimento"),
  desempenho: text("desempenho"),
  pontosFortes: text("pontos_fortes"),
  pontosMelhoria: text("pontos_melhoria"),
  recomendacao: text("recomendacao"),
  observacoes: text("observacoes"),
});

export const insertEmpresaSchema = createInsertSchema(empresas).omit({
  id: true,
});

export const insertGestorSchema = createInsertSchema(gestores).omit({
  id: true,
});

export const insertFuncionarioSchema = createInsertSchema(funcionarios).omit({
  id: true,
});

export const insertDesligamentoSchema = createInsertSchema(desligamentos).omit({
  id: true,
});

export const insertDocumentoFuncionarioSchema = createInsertSchema(documentosFuncionario).omit({
  id: true,
});

export const insertDocumentoGestorSchema = createInsertSchema(documentosGestor).omit({
  id: true,
});

export const insertFormularioExperienciaSchema = createInsertSchema(formulariosExperiencia).omit({
  id: true,
});

export type InsertEmpresa = z.infer<typeof insertEmpresaSchema>;
export type Empresa = typeof empresas.$inferSelect;

export type InsertGestor = z.infer<typeof insertGestorSchema>;
export type Gestor = typeof gestores.$inferSelect;

export type InsertFuncionario = z.infer<typeof insertFuncionarioSchema>;
export type Funcionario = typeof funcionarios.$inferSelect;

export type InsertDesligamento = z.infer<typeof insertDesligamentoSchema>;
export type Desligamento = typeof desligamentos.$inferSelect;

export type InsertDocumentoFuncionario = z.infer<typeof insertDocumentoFuncionarioSchema>;
export type DocumentoFuncionario = typeof documentosFuncionario.$inferSelect;

export type InsertDocumentoGestor = z.infer<typeof insertDocumentoGestorSchema>;
export type DocumentoGestor = typeof documentosGestor.$inferSelect;

export type InsertFormularioExperiencia = z.infer<typeof insertFormularioExperienciaSchema>;
export type FormularioExperiencia = typeof formulariosExperiencia.$inferSelect;
