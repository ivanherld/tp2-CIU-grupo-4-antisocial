import { createContext } from "react";
import type { Usuario } from "../types/Usuario";

export interface AuthContextType {
    usuario: Usuario | null;
    setUsuario: (usuario: Usuario | null) => void;
    cargando: boolean;
    setCargando: (cargando: boolean) => void;
    login: (nuevoUsuario: Usuario) => void;
    logout: () => void;
    loginWithCredentials: (username: string, password: string) => Promise<Usuario | null>;
    loginWithToken: (token: string) => Promise<Usuario | null>;
    follow?: (targetId: string) => Promise<any>;
    unfollow?: (targetId: string) => Promise<any>;
    isFollowing?: (targetId: string) => Promise<boolean>;
}


export const AuthContext = createContext<AuthContextType>({
    usuario: null,
    setUsuario: () => {},
    cargando: true,
    setCargando: () => {},
    login: () => {},
    logout: () => {},
    loginWithCredentials: async () => null,
    loginWithToken: async () => null,
    follow: async () => null,
    unfollow: async () => null,
    isFollowing: async () => false,
});
