import { createContext, useContext, useEffect } from "react";
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

  // Buscar dados do usuário autenticado
  const { data, isLoading, error } = useQuery<{ usuario: Usuario }>({
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
