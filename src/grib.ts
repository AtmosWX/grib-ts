import { BufferReader } from "./bufferReader";
import { Message } from "./message";
import { readBitmap } from "./sections/bitmap";
import { readData } from "./sections/data";
import { readDataRepresentation } from "./sections/dataRepresentation";
import { readGridDefinition } from "./sections/gridDefinition";
import { readIdentification } from "./sections/identification";
import { readIndicator } from "./sections/indicator";
import { readProductDefinition } from "./sections/productDefinition";

export class GribReader {
  reader: BufferReader;

  constructor(data: ArrayBuffer) {
    this.reader = new BufferReader(data);
    const header = this.reader.string(4, true);
    if (header != "GRIB") {
      throw new Error("Invalid format. Expected GRIB, found: " + header);
    }
  }

  *messages(): Generator<Message> {
    while (!this.reader.eof()) {
      const indicator = readIndicator(this.reader);
      const identification = readIdentification(this.reader);

      // Skip local use section if present
      const localUseLength = this.reader.u32();
      const localUseSectionNumber = this.reader.u8();
      if (localUseSectionNumber == 2) {
        this.reader.step(localUseLength - 5);
      } else {
        this.reader.step(-5);
      }

      const gridDefinition = readGridDefinition(this.reader);
      const productDefinition = readProductDefinition(this.reader);
      const dataRepresentation = readDataRepresentation(this.reader);
      const bitmap = readBitmap(this.reader);
      const data = readData(this.reader);

      const end = this.reader.string(4);
      if (end != "7777") {
        throw new Error("Expected end of GRIB message \"7777\", found: " + end);
      }

      yield {
        indicator,
        identification,
        gridDefinition,
        productDefinition,
        dataRepresentation,
        bitmap,
        data,
      };
    }
  }
}
