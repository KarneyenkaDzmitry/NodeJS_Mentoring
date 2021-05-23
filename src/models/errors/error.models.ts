import { THttpCode, THttpError } from "../../types/custom.error.type";

export abstract class ServiceError extends Error {
    code = "ERR_SERVICE_ERROR";
    name: string = this.constructor.name;
    private readonly _method: string;
    private readonly _arguments: Record<string, unknown>;
    private readonly _status: THttpCode;

    constructor(args: THttpError) {
        super(args.message);
        this._method = args.method;
        this._arguments = args.arguments;
        this._status = args.status ?? 500;
    }

    public toString(): string {
        return `${this.name} ${this.code}: ${this.message}\n ${this.stack}`;
    }

    get status(): number {
        return this._status;
    }

    get method(): string | undefined {
        return this._method;
    }

    get arguments(): Record<string, unknown> | undefined {
        return this._arguments;
    }
}

export class InternalServerError extends ServiceError {
    code = "ERR_INTERNAL_SERVER_ERROR";

    constructor(args: THttpError) {
        super({ ...args, status: 500 });
    }
}

export class NotFoundError extends ServiceError {
    code = "ERR_NOT_FOUND_ERROR";

    constructor(args: THttpError) {
        super({ ...args, status: 404 });
    }
}

export class BadCredentialsError extends ServiceError {
    code = "ERR_UNKNOWN_CREDENTIAL";

    constructor(args: THttpError) {
        super({ ...args, status: 403 });
    }
}

export class BadRequestError extends ServiceError {
    code = "ERR_BAD_REQUEST_ERROR";

    constructor(args: THttpError) {
        super({ ...args, status: 400 });
    }
}

export class TransactionError extends ServiceError {
    code = "ERR_BD_TRANSACTION_ERROR";

    constructor(args: THttpError) {
        super({ ...args, status: 405 });
    }
}

export class UnauthorizedError extends ServiceError {
    code = "ERR_CRYPTO_INVALID_JWK";

    constructor(args: THttpError) {
        super({ ...args, status: 401 });
    }
}
