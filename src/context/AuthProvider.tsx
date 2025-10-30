import { useContext, useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { Usuario } from "../types/Usuario.ts";



interface AuthProviderProps {
    children: ReactNode //children puede ser cualquier cosa que React pueda mostrar
}

export default function AuthProvider({children}: AuthProviderProps) { 
    // const [usuario, setUsuario] = useState<Usuario | null>(() => {
    //     const stored = localStorage.getItem("usuario")
    //     return stored ? JSON.parse(stored) : null
    // })

    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [cargando, setCCargando] = useState(true);


    //* Se supone que recupera el usuario guardado
    useEffect(() => {
        const stored = localStorage.getItem("usuario");
        if (stored) {
            setUsuario(JSON.parse(stored));
        }
        setCCargando(false); //* Se termina de verificar, esto es clave porque puede demorar nuestro servidor
    }, []);

    //* Guardamos en el LocalStorage el usuario
    const login = (nuevoUsuario: Usuario) => {
        setUsuario(nuevoUsuario);
        localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));
    }

    //* Borramos el usuario del LocalStorage
    const logout = () => {
        setUsuario(null);
        localStorage.removeItem("usuario");
    }


    return (
        <AuthContext.Provider value={{usuario, login, logout, cargando} as any}>
            {children}
        </AuthContext.Provider> 
    )
}

export function useAuth() {
    return useContext(AuthContext);
}