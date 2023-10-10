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
    const value = this.dv.getUint8(this.offset);
    if (!peek) {
      this.offset++;
    }
    if (Math.clz32(value << 24) == 0) {
      return -(value & 0x7f);
    }
    return value;
  }

  i16(peek: boolean = false): number {
    const value = this.dv.getUint8(this.offset);
    if (!peek) {
      this.offset += 2;
    }
    if (Math.clz32(value << 16) == 0) {
      return -(value & 0x7fff);
    }
    return value;
  }

  i32(peek: boolean = false): number {
    const value = this.dv.getUint32(this.offset);
    if (!peek) {
      this.offset += 4;
    }
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
