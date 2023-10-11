import { Bitmap } from "./sections/bitmap";
import { Data } from "./sections/data";
import { DataRepresentation } from "./sections/dataRepresentation";
import { GridDefinition } from "./sections/gridDefinition";
import { Identification } from "./sections/identification";
import { Indicator } from "./sections/indicator";
import { ProductDefinition } from "./sections/productDefinition";
import { DataRepresentationTemplateNumber } from "./templates/dataRepresentation";
import { unpackComplexPackingSpatialDifferencing } from "./unpackers/complexPackingSpatialDifferencing";
import { unpackSimplePacking } from "./unpackers/simplePacking";

export type Message = {
  indicator: Indicator;
  identification: Identification;
  gridDefinition: GridDefinition;
  productDefinition: ProductDefinition;
  dataRepresentation: DataRepresentation;
  bitmap: Bitmap;
  data: Data;
};

export function readMessageData(message: Message): number[] {
  switch (message.dataRepresentation.templateNumber) {
    case DataRepresentationTemplateNumber.SimplePacking: {
      return unpackSimplePacking(message);
    }

    case DataRepresentationTemplateNumber.ComplexPackingSpatialDifferencing: {
      return unpackComplexPackingSpatialDifferencing(message);
    }

    default: {
      throw new Error("Unknown data representation template number: " + message.dataRepresentation.templateNumber);
    }
  }
}
