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
    const [cargando, setCargando] = useState(true);
    const [following, setFollowing] = useState<Record<string, boolean>>({})


    //* Se supone que recupera el usuario guardado
    useEffect(() => {
        const stored = localStorage.getItem("usuario");
        if (stored) {
            setUsuario(JSON.parse(stored));
        }
        setCargando(false); //* Se termina de verificar, esto es clave porque puede demorar nuestro servidor
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
        localStorage.removeItem("token");
    }

    const toggleFollow = (username: string) => {
        setFollowing(prev => ({...prev, [username]: !prev[username]}))
    }

    return (
        <AuthContext.Provider value={{usuario, setUsuario, cargando, setCargando, login, logout, following, toggleFollow}}>
            {children}
        </AuthContext.Provider> 
    )
}

export function useAuth() {
    return useContext(AuthContext);
}