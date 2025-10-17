import { AppError } from "./AppError";

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
    }
}
export class UnauthorizedError extends AppError {
    constructor(message: string) {
        super(message, 401);
    }
}
export class ForbiddenError extends AppError {
    constructor(message: string) {
        super(message, 403);
    }
}