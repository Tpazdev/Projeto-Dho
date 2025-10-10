import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken, type JWTPayload } from "./auth";
import { storage } from "./storage";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.cookies?.accessToken;
    
    if (!accessToken) {
      return res.status(401).json({ error: "Não autenticado" });
    }
    
    const payload = verifyAccessToken(accessToken);
    if (!payload) {
      return res.status(401).json({ error: "Token inválido" });
    }
    
    // Verificar se o usuário ainda existe e está ativo
    const usuario = await storage.getUsuario(payload.usuarioId);
    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ error: "Usuário inválido" });
    }
    
    req.user = payload;
    next();
  } catch (error) {
    res.status(500).json({ error: "Erro ao verificar autenticação" });
  }
}

export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Acesso negado" });
    }
    
    next();
  };
}

export function requireNotAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Não autenticado" });
  }
  
  if (req.user.role === "admin") {
    return res.status(403).json({ error: "Administradores não podem preencher questionários" });
  }
  
  next();
}
