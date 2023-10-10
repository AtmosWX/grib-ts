import { BufferReader } from "../bufferReader";

export enum ProductDefinitionTemplateNumber {
  AnalysisOrForecast = 0,
};

export type ProductDefinitionTemplate = AnalysisOrForecast;

export type AnalysisOrForecast = {
  parameterCategory: number;
  parameter: number;
  generatingProcessType: number;
  generatingProcessId: number;
  generatingProcess: number;
  hourCutoff: number;
  minuteCutoff: number;
  timeUnitIndicator: number;
  forecastTime: number;
  firstSurfaceType: number;
  firstSurfaceScaleFactor: number;
  firstSurfaceValue: number;
  secondSurfaceType: number;
  secondSurfaceScaleFactor: number;
  secondSurfaceValue: number;
};

export function readProductDefinitionTemplate(reader: BufferReader, templateNumber: number): ProductDefinitionTemplate {
  switch (templateNumber) {
    case ProductDefinitionTemplateNumber.AnalysisOrForecast: {
      return {
        parameterCategory: reader.u8(),
        parameter: reader.u8(),
        generatingProcessType: reader.u8(),
        generatingProcessId: reader.u8(),
        generatingProcess: reader.u8(),
        hourCutoff: reader.u16(),
        minuteCutoff: reader.u8(),
        timeUnitIndicator: reader.u8(),
        forecastTime: reader.u32(),
        firstSurfaceType: reader.u8(),
        firstSurfaceScaleFactor: reader.i8(),
        firstSurfaceValue: reader.u32(),
        secondSurfaceType: reader.u8(),
        secondSurfaceScaleFactor: reader.i8(),
        secondSurfaceValue: reader.u32(),
      };
    }

    default: {
      throw new Error("Unsupported product definition template number: " + templateNumber);
    }
  }
}
