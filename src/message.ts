import { Bitmap } from "./sections/bitmap";
import { Data } from "./sections/data";
import { DataRepresentation } from "./sections/dataRepresentation";
import { GridDefinition } from "./sections/gridDefinition";
import { Identification } from "./sections/identification";
import { Indicator } from "./sections/indicator";
import { ProductDefinition } from "./sections/productDefinition";

export type Message = {
  indicator: Indicator;
  identification: Identification;
  gridDefinition: GridDefinition;
  productDefinition: ProductDefinition;
  dataRepresentation: DataRepresentation;
  bitmap: Bitmap;
  data: Data;
};
