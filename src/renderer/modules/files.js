const fs = require('fs')
const fsPromises = fs.promises

export async function readFileFloat32 (filename) {
  const buffer = await fsPromises.readFile(filename)
  const result = []
  for (let i = 0; i < buffer.length / 4; i++) {
    result.push(buffer.readFloatLE(4 * i));
  }
  return result
}
