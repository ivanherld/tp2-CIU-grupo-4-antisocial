import { createContext, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";

interface Usuario {
    nombre: string
}

interface AuthContextType {
    usuario: Usuario | null,
    setUsuario: Dispatch<SetStateAction<Usuario | null>>,
} //para poder hacer el setUsuario ^ (recibe un usuario / null/ funcion)

export const AuthContext = createContext<AuthContextType>({
    usuario: null,
    setUsuario: () => {}
}) 

interface AuthProviderProps {
    children: ReactNode //children puede ser cualquier cosa que React pueda mostrar
}

export default function AuthProvider({children}: AuthProviderProps) { 
    const [usuario, setUsuario] = useState<Usuario | null>(null)

    return (
        <AuthContext.Provider value={{usuario, setUsuario}}>
            {children}
        </AuthContext.Provider> 
    )
}