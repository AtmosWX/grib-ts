import { BufferReader } from "../bufferReader";

export type Identification = {
  length: number;
  sectionNumber: number;
  centerId: number;
  subcenterId: number;
  masterTableVersion: number;
  localTableVersion: number;
  referenceTime: number;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  productionStatus: number;
  dataType: number;
};

export function readIdentification(reader: BufferReader): Identification {
  return {
    length: reader.u32(),
    sectionNumber: reader.u8(),
    centerId: reader.u16(),
    subcenterId: reader.u16(),
    masterTableVersion: reader.u8(),
    localTableVersion: reader.u8(),
    referenceTime: reader.u8(),
    year: reader.u16(),
    month: reader.u8(),
    day: reader.u8(),
    hour: reader.u8(),
    minute: reader.u8(),
    second: reader.u8(),
    productionStatus: reader.u8(),
    dataType: reader.u8(),
  };
}
