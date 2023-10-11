import { BitReader, BufferReader, readPackedBits } from "../bufferReader";
import { Message } from "../message";
import { ComplexPackingSpatialDifferencing } from "../templates/dataRepresentation";

export function unpackComplexPackingSpatialDifferencing(message: Message): number[] {
  const reader = new BufferReader(message.data.buffer);
  const template = message.dataRepresentation.template as ComplexPackingSpatialDifferencing;

  if (template.missingValueManagement != 0) {
    throw new Error("Missing value unpacking not supported");
  }

  if (template.referenceValueBitCount == 0 && template.groupWidthBitCount == 0) {
    return new Array(message.gridDefinition.dataPointCount).fill(template.referenceValue);
  }

  const descriptors = readPackedBits(
    reader,
    template.spatialDifferenceOctetCount * (template.spatialDifferenceOrder + 1),
    (template.spatialDifferenceOrder + 1),
    template.spatialDifferenceOctetCount * 8,
  );

  const referenceValues = readPackedBits(
    reader,
    Math.ceil(template.referenceValueBitCount * template.groupCount / 8),
    template.groupCount,
    template.referenceValueBitCount,
    false,
  );

  const groupWidths = readPackedBits(
    reader,
    Math.ceil(template.groupWidthBitCount * template.groupCount / 8),
    template.groupCount,
    template.groupWidthBitCount,
    false,
  ).map(v => template.groupWidthReference + v);

  let groupLengths = readPackedBits(
    reader,
    Math.ceil(template.groupLengthBitCount * template.groupCount / 8),
    template.groupCount - 1,
    template.groupLengthBitCount,
    false,
  ).map(v => template.groupLengthReference + v);
  groupLengths.push(template.lastGroupTrueLength);

  let totalBits = 0;
  for (let i = 0; i < template.groupCount; i++) {
    totalBits += groupLengths[i] * groupWidths[i];
  }

  const valueReader = new BitReader(reader.bytes(Math.ceil(totalBits / 8)));
  const min = descriptors[2];
  let values: number[] = [];

  for (let i = 0; i < template.groupCount; i++) {
    const length = groupLengths[i];
    const width = groupWidths[i];
    const reference = referenceValues[i] + min;

    if (width == 0) {
      for (let j = 0; j < length; j++) {
        values.push(reference);
      }
      continue;
    }

    for (let j = 0; j < length; j++) {
      values.push(reference + valueReader.u32(width));
    }
  }

  let prev1 = descriptors[1];
  let prev2 = descriptors[0];
  const scalar = Math.pow(2, template.binaryScaleFactor);
  const divisor = Math.pow(10, template.decimalScaleFactor);

  for (let i = 0; i < values.length; i++) {
    const value = values[i] + 2 * prev1 - prev2;
    prev2 = prev1;
    prev1 = value;
    values[i] = (template.referenceValue + value * scalar) / divisor;
  }

  return values;
}
