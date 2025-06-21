import { IncomingMessage } from "http";

export type Handler = (
    req: IncomingMessage,
    params: Record<string, string>
  ) => any | Promise<any>;