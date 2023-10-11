import { readFileSync } from "fs";
import { GribReader } from "../src/grib";
import { readMessageData } from "../src/message";

const data = readFileSync("sample_data/TMP-HAGL-2.grib2");
const gribReader = new GribReader(data.buffer);
for (const message of gribReader.messages()) {
  readMessageData(message);
}
