import { useContext, useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import api from '../api';
import type { Usuario, LoginResponse } from "../types/Usuario";



interface AuthProviderProps {
    children: ReactNode 
}

export default function AuthProvider({children}: AuthProviderProps) { 
   
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [cargando, setCargando] = useState(true);
    


    
    useEffect(() => {
        const stored = localStorage.getItem("usuario");
        if (stored) {
            setUsuario(JSON.parse(stored));
        }
        setCargando(false); 
    }, []);

    
    const login = (nuevoUsuario: Usuario) => {
        setUsuario(nuevoUsuario);
        localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));
    }

    
    const logout = () => {
        setUsuario(null);
        
        localStorage.removeItem("usuario");
        localStorage.removeItem('token');
        if (api.defaults.headers.common['Authorization']) {
            delete api.defaults.headers.common['Authorization'];
        }
    }

    
    const loginWithToken = async (token: string) : Promise<Usuario | null> => {
        try {
            localStorage.setItem('token', token);
            
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            
            const profileRes = await api.get<Usuario>('/auth/me');
            const usuarioObj = profileRes.data;
            setUsuario(usuarioObj);
            localStorage.setItem('usuario', JSON.stringify(usuarioObj));
            return usuarioObj;
        } catch (err) {
            
            localStorage.removeItem('token');
            return null;
        }
    };

    
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
        
        if (res.data.user) {
            const user = res.data.user;
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUsuario(user);
            localStorage.setItem('usuario', JSON.stringify(user));
            return user;
        }
        
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