export const getMousePosition = (element: HTMLElement, event: MouseEvent): [number, number] => {
  const bounding = element.getBoundingClientRect();
  const x = 2 * ((event.x - bounding.left) / bounding.width) - 1;
  const y = -2 * ((event.y - bounding.top) / bounding.height) + 1;
  return [x, y]
}

export function convertHexToRGB(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return [
    parseInt(result[1], 16) / 256,
    parseInt(result[2], 16) / 256,
    parseInt(result[3], 16) / 256
  ]
}