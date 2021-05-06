export declare type THttpCode = 500 | 400 | 401 | 404 | 405;

export declare type THttpError = {
    message: string;
    method: string;
    status?: statusCode;
    arguments: Record<string, unknown>;
};
