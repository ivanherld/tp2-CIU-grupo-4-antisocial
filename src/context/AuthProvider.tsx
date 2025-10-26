import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { Usuario } from "../types/Usuario.ts";


interface AuthProviderProps {
    children: ReactNode //children puede ser cualquier cosa que React pueda mostrar
}

export default function AuthProvider({children}: AuthProviderProps) { 
    const [usuario, setUsuario] = useState<Usuario | null>(() => {
        const stored = localStorage.getItem("usuario")
        return stored ? JSON.parse(stored) : null
    })

    return (
        <AuthContext.Provider value={{usuario, setUsuario}}>
            {children}
        </AuthContext.Provider> 
    )
}