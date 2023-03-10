export class BadRequestError extends Error {
  status: number = 400;
  constructor(message?: string) {
    super(message);
    this.message = 'Bad request error: ' + message;
  }
}
