import { BufferReader } from "../bufferReader";

export type Data = {
  length: number;
  sectionNumber: number;
};

export function readData(reader: BufferReader): Data {
  return {
    length: reader.u32(),
    sectionNumber: reader.u8(),
  };
}
