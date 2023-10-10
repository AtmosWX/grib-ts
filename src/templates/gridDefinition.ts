import { BufferReader } from "../bufferReader";

export enum GridDefinitionTemplateNumber {
  LatitudeLongitude = 0,
};

export type GridDefinitionTemplate = LatitudeLongitude;

export type LatitudeLongitude = {
  shape: number;
  radiusScale: number;
  radiusScaleFactor: number;
  majorAxisScaleFactor: number;
  majorAxisScale: number;
  minorAxisScaleFactor: number;
  minorAxisScale: number;
  parallelPoints: number;
  meridianPoints: number;
  basicAngle: number;
  basicAngleSubdivisions: number;
  firstLatitude: number;
  firstLongitude: number;
  resolutionFlag: number;
  lastLatitude: number;
  lastLongitude: number;
  iDirectionInc: number;
  jDirectionInc: number;
  scanningModeFlag: number;
};

export function readGridDefinitionTemplate(reader: BufferReader, templateNumber: number): GridDefinitionTemplate {
  switch (templateNumber) {
    case GridDefinitionTemplateNumber.LatitudeLongitude: {
      return {
        shape: reader.u8(),
        radiusScale: reader.u32(),
        radiusScaleFactor: reader.u8(),
        majorAxisScaleFactor: reader.u8(),
        majorAxisScale: reader.u32(),
        minorAxisScaleFactor: reader.u8(),
        minorAxisScale: reader.u32(),
        parallelPoints: reader.u32(),
        meridianPoints: reader.u32(),
        basicAngle: reader.u32(),
        basicAngleSubdivisions: reader.u32(),
        firstLatitude: reader.i32(),
        firstLongitude: reader.i32(),
        resolutionFlag: reader.u8(),
        lastLatitude: reader.i32(),
        lastLongitude: reader.i32(),
        iDirectionInc: reader.i32(),
        jDirectionInc: reader.i32(),
        scanningModeFlag: reader.u8(),
      };
    }

    default: {
      throw new Error("Unsupported grid definition template number: " + templateNumber);
    }
  }
}
