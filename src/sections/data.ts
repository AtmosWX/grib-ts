import { BufferReader } from "../bufferReader";

export type Data = {
  length: number;
  sectionNumber: number;
  buffer: ArrayBuffer;
};

export function readData(reader: BufferReader): Data {
  const length = reader.u32();
  return {
    length,
    sectionNumber: reader.u8(),
    buffer: reader.bytes(length - 5),
  };
}
