export type JwtPayload = {
    sub: string;
    email: string;
    jti: string;
    iat: number;
    exp: number;
};

export type JwtSignPayload = {
    sub: string;
    email: string;
};