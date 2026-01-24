import {
  ClientReadableStream,
  ClientUnaryCall,
  Metadata,
  ServiceError,
} from "@grpc/grpc-js";
import { CallOptions } from "@grpc/grpc-js/build/src/client";

export interface UnaryCall<R, O> {
  (
    request: R,
    callback: (error: ServiceError | null, response: O) => void,
  ): ClientUnaryCall;
  (
    request: R,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: O) => void,
  ): ClientUnaryCall;
  (
    request: R,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: O) => void,
  ): ClientUnaryCall;
}

export function unaryCallToPromise<R, O>(unaryCall: UnaryCall<R, O>) {
  return (request: R) => {
    return new Promise<O>((resolve, reject) => {
      const m = new Metadata();
      m.add("cache", "no-store");
      unaryCall(request, m, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        if (!result) {
          reject(new NotFoundError());
          return;
        }
        resolve(result);
      });
    });
  };
}

export interface ServerStreamCall<R, O> {
  (argument: R, options?: CallOptions): ClientReadableStream<O>;
}

export function serverStreamCallToPromise<R, O>(
  serverStreamCall: ServerStreamCall<R, O>,
) {
  return (request: R) => {
    const stream = serverStreamCall(request);
    return streamToArray(stream);
  };
}

export function streamToArray<T>(stream: ClientReadableStream<T>) {
  const items: T[] = [];

  return new Promise<T[]>((resolve, reject) => {
    stream.on("data", (item) => {
      items.push(item);
    });
    stream.on("end", () => {
      resolve(items);
    });
    stream.on("error", reject);
  });
}

export class NotFoundError extends Error {
  constructor() {
    super("not found");
  }
}
