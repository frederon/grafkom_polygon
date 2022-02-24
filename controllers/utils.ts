export function convertHexToRGB(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return [
    parseInt(result[1], 16) / 256,
    parseInt(result[2], 16) / 256,
    parseInt(result[3], 16) / 256
  ]
}