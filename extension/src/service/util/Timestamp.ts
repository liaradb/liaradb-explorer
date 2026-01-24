import { Timestamp as TimestampDto } from "google-protobuf/google/protobuf/timestamp_pb";

export class Timestamp implements GrpcTimestamp {
  constructor(public seconds: number, public nanos: number) { }

  toDate(): Date {
    return new Date(Math.floor(this.seconds * 1000 + this.nanos / 1000));
  }

  toISOString(): string {
    const date = this.toDate();
    return date.toISOString();
  }

  toTimestamp(): TimestampDto {
    const timestamp = new TimestampDto()
    timestamp.setNanos(this.nanos)
    timestamp.setSeconds(this.seconds)
    return timestamp
  }

  static fromDate(date: Date): Timestamp {
    const time = date.getTime();
    const seconds = Math.floor(time / 1000);
    const nanos = (time % 1000) * 1000;
    return new Timestamp(seconds, nanos);
  }

  static fromDto(dto: TimestampDto) {
    return new Timestamp(dto.getSeconds(), dto.getNanos());
  }

  static parse(value: string | undefined): Timestamp | undefined {
    if (!value) {
      return undefined;
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return undefined;
    }
    const time = date.getTime();
    const seconds = Math.floor(time / 1000);
    const nanos = (time % 1000) * 1000;
    return new Timestamp(seconds, nanos);
  }

  static fromTimestamp(
    timestamp: Timestamp__Output | null
  ): Timestamp | undefined {
    if (!timestamp) {
      return undefined;
    }
    const { nanos = 0, seconds } = timestamp;
    return new Timestamp(parseInt(seconds), nanos);
  }

  static toIsoString(timestamp: Timestamp__Output | null): string {
    return this.fromTimestamp(timestamp)?.toISOString() ?? "";
  }

  static toDate(timestamp: Timestamp__Output | null): Date | undefined {
    return this.fromTimestamp(timestamp)?.toDate();
  }

  static toTimestamp(timestamp: Timestamp__Output | null) {
    return this.fromTimestamp(timestamp)?.toTimestamp()
  }
}

export interface GrpcTimestamp {
  seconds?: number | string;
  nanos?: number;
}

export interface Timestamp__Output {
  seconds: string;
  nanos: number;
}
