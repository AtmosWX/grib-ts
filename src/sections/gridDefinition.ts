import { BufferReader } from "../bufferReader";
import { GridDefinitionTemplate, GridDefinitionTemplateNumber, readGridDefinitionTemplate } from "../templates/gridDefinition";

export type GridDefinition = {
  length: number;
  sectionNumber: number;
  source: number;
  dataPointCount: number;
  octetCount: number;
  interpretation: number;
  templateNumber: GridDefinitionTemplateNumber;
  template: GridDefinitionTemplate;
};

export function readGridDefinition(reader: BufferReader): GridDefinition {
  return {
    length: reader.u32(),
    sectionNumber: reader.u8(),
    source: reader.u8(),
    dataPointCount: reader.u32(),
    octetCount: reader.u8(),
    interpretation: reader.u8(),
    templateNumber: reader.u16(true),
    template: readGridDefinitionTemplate(reader, reader.u16()),
  };
}
