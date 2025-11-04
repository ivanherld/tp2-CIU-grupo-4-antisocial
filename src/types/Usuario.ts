export interface Usuario {
    //
    id: number,
    username: string,
    email?: string
    
} //token

export interface LoginResponse {
  token: string;
  user: Usuario;
}