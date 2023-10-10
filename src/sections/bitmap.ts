import { BufferReader } from "../bufferReader";

export type Bitmap = {
  length: number;
  sectionNumber: number;
  bitmapIndicator: number;
  bitmap: ArrayBuffer;
};

export function readBitmap(reader: BufferReader): Bitmap {
  const length = reader.u32();
  return {
    length,
    sectionNumber: reader.u8(),
    bitmapIndicator: reader.u8(),
    bitmap: reader.bytes(length - 6),
  };
}
