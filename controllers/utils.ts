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

export type Coordinate = [number, number]

export function onSegment(p: Coordinate, q: Coordinate, r: Coordinate) {
  if (q[0] <= Math.max(p[0], r[0]) &&
    q[0] >= Math.min(p[0], r[0]) &&
    q[1] <= Math.max(p[1], r[1]) &&
    q[1] >= Math.min(p[1], r[1])) {
    return true;
  }
  return false;
}

export function orient(p: Coordinate, q: Coordinate, r: Coordinate) {
  let val = (q[1] - p[1]) * (r[0] - q[0]) -
    (q[0] - p[0]) * (r[1] - q[1]);

  if (val == 0) return 0;

  return (val > 0) ? 1 : 2;
}

export function doIntersect(p1: Coordinate, q1: Coordinate, p2: Coordinate, q2: Coordinate) {
  let o1 = orient(p1, q1, p2);
  let o2 = orient(p1, q1, q2);
  let o3 = orient(p2, q2, p1);
  let o4 = orient(p2, q2, q1);

  if (o1 != o2 && o3 != o4) {
    return true;
  }

  if (o1 == 0 && onSegment(p1, p2, q1)) {
    return true;
  }

  if (o2 == 0 && onSegment(p1, q2, q1)) {
    return true;
  }

  if (o3 == 0 && onSegment(p2, p1, q2)) {
    return true;
  }

  if (o4 == 0 && onSegment(p2, q1, q2)) {
    return true;
  }

  return false;
}

export function isInside(polygon: Array<Coordinate>, n: number, p: Coordinate) {
  if (n < 3) {
    return false;
  }

  let extreme: Coordinate = [10000, p[1]];

  let count = 0,
    i = 0;

  do {
    let next = (i + 1) % n;


    if (doIntersect(polygon[i], polygon[next], p, extreme)) {
      if (orient(polygon[i], p, polygon[next]) == 0) {
        return onSegment(polygon[i], p, polygon[next]);
      }

      count++;
    }
    i = next;
  } while (i != 0);

  return (count % 2 == 1);
}

export function getArrOfCoordinates(vertices: Array<number>) {
  var arr: Array<Coordinate> = [];
  for (var i = 0; i < vertices.length; i += 2) {
    arr.push([vertices[i], vertices[i + 1]]);
  }
  return arr;
}

export function isInline(A: Coordinate, B: Coordinate, C: Coordinate) {
  const errorDelta = 0.01;
  const dis1 = distance(A, B);
  const dis2 = distance(B, C);
  const dis3 = distance(A, C);
  return dis1 - errorDelta <= dis2 + dis3 &&
    dis2 + dis3 <= dis1 + errorDelta;
}

export function distance(A: Coordinate, B: Coordinate) {
  return Math.sqrt(Math.pow((A[0] - B[0]), 2) +
    Math.pow((A[1] - B[1]), 2));
}
