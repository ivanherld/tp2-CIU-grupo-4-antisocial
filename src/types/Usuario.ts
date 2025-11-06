export interface Usuario {
    id: number,
    username: string,
    email?: string
}

export interface LoginResponse {
  token: string;
  user: Usuario;
}