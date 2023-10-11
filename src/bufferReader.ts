export class BufferReader {
  private dv: DataView;
  private offset: number;
  private decoder: TextDecoder;

  constructor(data: ArrayBuffer) {
    this.dv = new DataView(data);
    this.offset = 0;
    this.decoder = new TextDecoder("utf-8");
  }

  eof(): boolean {
    return this.offset == this.dv.byteLength;
  }

  getOffset(): number {
    return this.offset;
  }

  seek(offset: number): void {
    this.offset = offset;
  }

  step(offset: number): void {
    this.offset += offset;
  }

  bytes(length: number, peek: boolean = false): ArrayBuffer {
    const bytes = this.dv.buffer.slice(this.offset, this.offset + length);
    if (!peek) {
      this.offset += length;
    }
    return bytes;
  }

  string(length: number, peek: boolean = false): string {
    const bytes = this.bytes(length, peek);
    return this.decoder.decode(bytes);
  }

  u8(peek: boolean = false): number {
    const value = this.dv.getUint8(this.offset);
    if (!peek) {
      this.offset++;
    }
    return value;
  }

  u16(peek: boolean = false): number {
    const value = this.dv.getUint16(this.offset);
    if (!peek) {
      this.offset += 2;
    }
    return value;
  }

  u32(peek: boolean = false): number {
    const value = this.dv.getUint32(this.offset);
    if (!peek) {
      this.offset += 4;
    }
    return value;
  }

  u64(peek: boolean = false): number {
    const value = this.dv.getBigUint64(this.offset);
    if (!peek) {
      this.offset += 8;
    }
    return Number(value);
  }

  i8(peek: boolean = false): number {
    const value = this.u8(peek);
    if (Math.clz32(value << 24) == 0) {
      return -(value & 0x7f);
    }
    return value;
  }

  i16(peek: boolean = false): number {
    const value = this.u16(peek);
    if (Math.clz32(value << 16) == 0) {
      return -(value & 0x7fff);
    }
    return value;
  }

  i32(peek: boolean = false): number {
    const value = this.u32(peek);
    if (Math.clz32(value) == 0) {
      return -(value & 0x7fffffff);
    }
    return value;
  }

  f32(peek: boolean = false): number {
    const value = this.dv.getFloat32(this.offset);
    if (!peek) {
      this.offset += 4;
    }
    return value;
  }
}

const bitmasks = Array(32).fill(0).map((_, i) => {
  return Math.pow(2, i) - 1;
});

export class BitReader {
  private buffer: Uint8Array;
  private offset: number;
  private prevOverflow: number;

  constructor(data: ArrayBuffer) {
    this.buffer = new Uint8Array(data);
    this.offset = 0;
    this.prevOverflow = 0;
  }

  u32(bits: number): number {
    let newOffset = this.offset + bits;
    let overflow = newOffset % 8;
    let startByte = Math.floor(this.offset / 8);
    let endByte = Math.floor(newOffset / 8);

    if (overflow == 0) {
      endByte -= 1;
    }

    let totalBytes = endByte - startByte;
    let value = 0;

    for (let i = 0; i <= totalBytes; i++) {
      value |= (this.buffer[startByte + i]) << (8 * (totalBytes - i));
    }

    if (overflow != 0) {
      value >>= 8 - overflow;
    }

    if (this.prevOverflow != 0) {
      value &= bitmasks[bits];
    }

    this.offset = newOffset;
    this.prevOverflow = overflow;

    return value;
  }

  i32(bits: number): number {
    const value = this.u32(bits);
    if (Math.clz32(value << 32 - bits >>> 0) == 0) {
      return -(value & bitmasks[bits] >> 1);
    }
    return value;
  }
}

export function readPackedBits(reader: BufferReader, byteCount: number, valueCount: number, bitsPerValue: number, signed: boolean = true): number[] {
  const bitReader = new BitReader(reader.bytes(byteCount));
  let values: number[] = [];
  for (let i = 0; i < valueCount; i++) {
    values.push(signed ? bitReader.i32(bitsPerValue) : bitReader.u32(bitsPerValue));
  }
  return values;
}
