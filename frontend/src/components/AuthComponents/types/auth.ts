export interface UserData {
  username?: string
  email: string
  password: string
  role_id?: number
}

export interface AuthResponse {
  message: string
  user?: {
    id: number
    username: string
    email: string
  }
  token?: string
  error?: string
}
