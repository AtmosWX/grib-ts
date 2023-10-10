import { BufferReader } from "../bufferReader";
import { ProductDefinitionTemplate, ProductDefinitionTemplateNumber, readProductDefinitionTemplate } from "../templates/productDefinition";

export type ProductDefinition = {
  length: number;
  sectionNumber: number;
  coordinateValueCount: number;
  templateNumber: ProductDefinitionTemplateNumber;
  template: ProductDefinitionTemplate;
};

export function readProductDefinition(reader: BufferReader): ProductDefinition {
  return {
    length: reader.u32(),
    sectionNumber: reader.u8(),
    coordinateValueCount: reader.u16(),
    templateNumber: reader.u16(true),
    template: readProductDefinitionTemplate(reader, reader.u16()),
  };
}
