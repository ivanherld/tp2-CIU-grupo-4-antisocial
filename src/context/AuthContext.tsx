import { createContext } from "react";
import type { Usuario } from "../types/Usuario.ts"; 

export interface AuthContextType {
    usuario: Usuario | null,
    setUsuario: (usuario: Usuario | null) => void,
    cargando: boolean,
    setCargando: (cargando: boolean) => void,
    // helpers provided by the provider
    login: (nuevoUsuario: Usuario) => void,
    logout: () => void,
    following: Record<string, boolean>
    toggleFollow: (username: string) => void
} //para poder hacer el setUsuario ^ (recibe un usuario / null)

export const AuthContext = createContext<AuthContextType>({
    usuario: null,
    setUsuario: () => {},
    cargando: true,
    setCargando: () => {},
    login: () => {},
    logout: () => {},
    following: {},
    toggleFollow: () => {} 
}) 
