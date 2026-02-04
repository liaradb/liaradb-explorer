export class Outbox {
  constructor(
    private id: string,
    private globalVersion: number,
    private low: number,
    private high: number,
  ) {}

  getId() {
    return this.id;
  }

  getGlobalVersion() {
    return this.globalVersion;
  }

  getLow() {
    return this.low;
  }

  getHigh() {
    return this.high;
  }

  getName() {
    if (this.low == this.high) {
      return `Partition ${this.low}`;
    }

    return `Partition ${this.low} - ${this.high}`;
  }
}
