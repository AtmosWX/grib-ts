import { readFileSync } from "fs";
import { GribReader } from "../src/grib";

const data = readFileSync("sample_data/TMP-HAGL-2.grib2");
const gribReader = new GribReader(data.buffer);
for (const message of gribReader.messages()) {
  console.log(message);
}
