import { createContext } from "react";
import type { Usuario } from "../types/Usuario.ts"; 

export interface AuthContextType {
    usuario: Usuario | null,
    setUsuario: (usuario: Usuario | null) => void,
} //para poder hacer el setUsuario ^ (recibe un usuario / null)

export const AuthContext = createContext<AuthContextType>({
    usuario: null,
    setUsuario: () => {}
}) 
