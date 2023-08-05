import { ResponseBase } from ".";

export class ResponseData extends ResponseBase {
  constructor(
    public statusCode: number,
    public message: string,
    public data: any
  ) {
    super(statusCode, message);
  }
}
