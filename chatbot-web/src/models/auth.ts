export interface User {
    id: string;
    name: string;
    email: string;
}

export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignUpRequest {
    name: string;
    email: string;
    password: string;
}
