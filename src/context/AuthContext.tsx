import { createContext } from "react";
import type { Usuario } from "../types/Usuario";

export interface AuthContextType {
    usuario: Usuario | null;
    setUsuario: (usuario: Usuario | null) => void;
    cargando: boolean;
    setCargando: (cargando: boolean) => void;
    // helpers provided by the provider
    // legacy simple setter (kept for compatibility)
    login: (nuevoUsuario: Usuario) => void;
    logout: () => void;
    // centralized login helpers that perform HTTP, persist token and hydrate usuario
    loginWithCredentials: (username: string, password: string) => Promise<Usuario | null>;
    loginWithToken: (token: string) => Promise<Usuario | null>;
}

// create default no-op implementations for the context
export const AuthContext = createContext<AuthContextType>({
    usuario: null,
    setUsuario: () => {},
    cargando: true,
    setCargando: () => {},
    login: () => {},
    logout: () => {},
    loginWithCredentials: async () => null,
    loginWithToken: async () => null,
});
