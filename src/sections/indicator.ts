import { BufferReader } from "../bufferReader";

export type Indicator = {
  format: string;
  discipline: number;
  edition: number;
  length: number;
};

export function readIndicator(reader: BufferReader): Indicator {
  const format = reader.string(4);
  reader.step(2);
  return {
    format,
    discipline: reader.u8(),
    edition: reader.u8(),
    length: reader.u64(),
  };
}
