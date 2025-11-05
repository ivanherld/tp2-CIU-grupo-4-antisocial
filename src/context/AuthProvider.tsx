import { useContext, useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import api from '../api';
import type { Usuario, LoginResponse } from "../types/Usuario";



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
    // const [following, setFollowing] = useState<Record<string, boolean>>({})


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
        // remove persisted user and token, and clear axios auth header
        localStorage.removeItem("usuario");
        localStorage.removeItem('token');
        if (api.defaults.headers.common['Authorization']) {
            delete api.defaults.headers.common['Authorization'];
        }
    }

    // Centralized helpers -------------------------------------------------
    const loginWithToken = async (token: string) : Promise<Usuario | null> => {
        try {
            localStorage.setItem('token', token);
            // set axios header for immediate subsequent requests
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // obtain profile from server
            const profileRes = await api.get<Usuario>('/auth/me');
            const usuarioObj = profileRes.data;
            setUsuario(usuarioObj);
            localStorage.setItem('usuario', JSON.stringify(usuarioObj));
            return usuarioObj;
        } catch (err) {
            // if profile fetch fails, clear token
            localStorage.removeItem('token');
            return null;
        }
    };

    // Follow helpers - minimal, use actor from usuario state
    const follow = async (targetId: string) => {
        if (!usuario?.id) throw new Error('Not authenticated');
        const actorId = encodeURIComponent(String(usuario.id));
        const tid = encodeURIComponent(String(targetId));
        const res = await api.post(`/user/${actorId}/follow/${tid}`);
        return res.data;
    };

    const unfollow = async (targetId: string) => {
        if (!usuario?.id) throw new Error('Not authenticated');
        const actorId = encodeURIComponent(String(usuario.id));
        const tid = encodeURIComponent(String(targetId));
        const res = await api.delete(`/user/${actorId}/unfollow/${tid}`);
        return res.data;
    };

    const isFollowing = async (targetId: string) => {
        if (!usuario?.id) return false;
        try {
            const tid = encodeURIComponent(String(targetId));
            const res = await api.get<any[]>(`/user/${tid}/seguidores`);
            const myId = String(usuario.id);
            return (res.data || []).some((u: any) => String(u.id) === myId);
        } catch (e) {
            console.warn('isFollowing failed', e);
            return false;
        }
    };

    const loginWithCredentials = async (username: string, password: string): Promise<Usuario | null> => {
        const res = await api.post<LoginResponse>('/auth/login', { username, password });
        const token = res.data.token;
        // if server returns user in body use it directly
        if (res.data.user) {
            const user = res.data.user;
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUsuario(user);
            localStorage.setItem('usuario', JSON.stringify(user));
            return user;
        }
        // otherwise use token to fetch profile
        return loginWithToken(token);
    };


    return (
        <AuthContext.Provider value={{usuario, setUsuario, cargando, setCargando, login, logout, loginWithCredentials, loginWithToken, follow, unfollow, isFollowing}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}