export class InternalError extends Error{
    status: number = 500;
    constructor(message ?: string){
        super(message)
        this.message = 'Internal error: ' + message;
    }
}