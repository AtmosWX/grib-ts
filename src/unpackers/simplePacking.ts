import { Message } from "../message";
import { BufferReader, readPackedBits } from "../bufferReader";
import { SimplePacking } from "../templates/dataRepresentation";

export function unpackSimplePacking(message: Message): number[] {
  const reader = new BufferReader(message.data.buffer);
  const template = message.dataRepresentation.template as SimplePacking;

  if (template.referenceValueBitCount == 0) {
    return new Array(message.gridDefinition.dataPointCount).fill(template.referenceValue);
  }

  const scalar = Math.pow(2, template.binaryScaleFactor);
  const divisor = Math.pow(10, template.decimalScaleFactor);

  return readPackedBits(
    reader,
    Math.ceil(template.referenceValueBitCount * message.gridDefinition.dataPointCount / 8),
    message.gridDefinition.dataPointCount,
    template.referenceValueBitCount,
  ).map(v => (template.referenceValue + v * scalar) / divisor);
}
