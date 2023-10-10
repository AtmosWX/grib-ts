import { BufferReader } from "../bufferReader";
import { DataRepresentationTemplate, DataRepresentationTemplateNumber, readDataRepresentationTemplate } from "../templates/dataRepresentation";

export type DataRepresentation = {
  length: number;
  sectionNumber: number;
  dataPointBitmapCount: number;
  templateNumber: DataRepresentationTemplateNumber;
  template: DataRepresentationTemplate;
};

export function readDataRepresentation(reader: BufferReader): DataRepresentation {
  return {
    length: reader.u32(),
    sectionNumber: reader.u8(),
    dataPointBitmapCount: reader.u32(),
    templateNumber: reader.u16(true),
    template: readDataRepresentationTemplate(reader, reader.u16()),
  };
}
