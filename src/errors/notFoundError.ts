export class NotFoundError extends Error {
  status: number = 404;
  constructor(message?: string) {
    super(message);
    this.message = 'Not found error: ' + message;
  }
}
