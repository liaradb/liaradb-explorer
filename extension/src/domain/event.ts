export class Event {
  constructor(
    public aggregateId: string,
    public aggregateName: string,
    public data: string | Uint8Array<ArrayBufferLike>,
    public id: string,
    public name: string,
    public schema: string,
    public version: number,
  ) {}
}
