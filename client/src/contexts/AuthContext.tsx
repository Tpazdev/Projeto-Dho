import { createContext, useContext, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Buscar dados do usuário autenticado
  const { data, isLoading, error, refetch } = useQuery<{ usuario: Usuario }>({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout", {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/me"], null);
      setLocation("/login");
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado do sistema",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao fazer logout",
        variant: "destructive",
      });
    },
  });

  // Função para refresh do token
  const refreshToken = async () => {
    try {
      const response = await apiRequest("POST", "/api/auth/refresh", {});
      if (response.ok) {
        // Token renovado com sucesso, atualizar dados do usuário
        await refetch();
        // Programar próximo refresh (14 minutos)
        scheduleTokenRefresh();
      } else {
        // Falha no refresh, fazer logout
        queryClient.setQueryData(["/api/auth/me"], null);
        setLocation("/login");
      }
    } catch (error) {
      // Erro no refresh, fazer logout
      queryClient.setQueryData(["/api/auth/me"], null);
      setLocation("/login");
    }
  };

  // Programar refresh automático do token
  const scheduleTokenRefresh = () => {
    // Limpar timeout anterior se existir
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    // Programar refresh para 14 minutos (1 minuto antes da expiração)
    refreshTimeoutRef.current = setTimeout(() => {
      refreshToken();
    }, 14 * 60 * 1000);
  };

  // Configurar refresh automático quando usuário estiver autenticado
  useEffect(() => {
    if (data?.usuario) {
      scheduleTokenRefresh();
    }
    
    // Cleanup ao desmontar
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [data?.usuario]);

  // Redirecionar para login se não autenticado
  useEffect(() => {
    if (!isLoading && error && location !== "/login") {
      setLocation("/login");
    }
  }, [isLoading, error, location, setLocation]);

  // Redirecionar do login para home se já autenticado
  useEffect(() => {
    if (!isLoading && data?.usuario && location === "/login") {
      setLocation("/");
    }
  }, [isLoading, data, location, setLocation]);

  const value: AuthContextType = {
    usuario: data?.usuario || null,
    isLoading,
    isAuthenticated: !!data?.usuario,
    logout: () => logoutMutation.mutate(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
