import { BufferReader } from "../bufferReader";

export enum DataRepresentationTemplateNumber {
  SimplePacking = 0,
  ComplexPackingSpatialDifferencing = 3,
};

export type DataRepresentationTemplate =
  | SimplePacking
  | ComplexPackingSpatialDifferencing;

export type SimplePacking = {
  referenceValue: number;
  binaryScaleFactor: number;
  decimalScaleFactor: number;
  referenceValueBitCount: number;
  originalFieldType: number;
};

export type ComplexPackingSpatialDifferencing = {
  referenceValue: number;
  binaryScaleFactor: number;
  decimalScaleFactor: number;
  referenceValueBitCount: number;
  originalFieldType: number;
  splittingMethod: number;
  missingValueManagement: number;
  primarySubstitute: number;
  secondarySubstitute: number;
  groupCount: number;
  groupWidthReference: number;
  groupWidthBitCount: number;
  groupLengthReference: number;
  groupLengthInc: number;
  lastGroupTrueLength: number;
  groupLengthBitCount: number;
  spatialDifferenceOrder: SpatialDifferencingOrder;
  spatialDifferenceOctetCount: number;
};

export enum SpatialDifferencingOrder {
  Second = 2,
}

export function readDataRepresentationTemplate(reader: BufferReader, templateNumber: number): DataRepresentationTemplate {
  switch (templateNumber) {
    case DataRepresentationTemplateNumber.SimplePacking: {
      return {
        referenceValue: reader.f32(),
        binaryScaleFactor: reader.i16(),
        decimalScaleFactor: reader.i16(),
        referenceValueBitCount: reader.u8(),
        originalFieldType: reader.u8(),
      };
    }

    case DataRepresentationTemplateNumber.ComplexPackingSpatialDifferencing: {
      return {
        referenceValue: reader.f32(),
        binaryScaleFactor: reader.i16(),
        decimalScaleFactor: reader.i16(),
        referenceValueBitCount: reader.u8(),
        originalFieldType: reader.u8(),
        splittingMethod: reader.u8(),
        missingValueManagement: reader.u8(),
        primarySubstitute: reader.u32(),
        secondarySubstitute: reader.u32(),
        groupCount: reader.u32(),
        groupWidthReference: reader.u8(),
        groupWidthBitCount: reader.u8(),
        groupLengthReference: reader.u32(),
        groupLengthInc: reader.u8(),
        lastGroupTrueLength: reader.u32(),
        groupLengthBitCount: reader.u8(),
        spatialDifferenceOrder: reader.u8(),
        spatialDifferenceOctetCount: reader.u8(),
      };
    }

    default: {
      throw new Error("Unsupported data representation template number: " + templateNumber);
    }
  }
}
