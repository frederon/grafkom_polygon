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

let INF = 10000;

export class Titik {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export function onSegment(p: Titik, q: Titik, r: Titik) {
  if (q.x <= Math.max(p.x, r.x) &&
    q.x >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) &&
    q.y >= Math.min(p.y, r.y)) {
    return true;
  }
  return false;
}

export function orient(p: Titik, q: Titik, r: Titik) {
  let val = (q.y - p.y) * (r.x - q.x) -
    (q.x - p.x) * (r.y - q.y);

  if (val == 0) {
    return 0;
  }
  return (val > 0) ? 1 : 2;
}


export function doIntersect(p1: Titik, q1: Titik, p2: Titik, q2: Titik) {
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


export function isInside(polygon: Array<Titik>, n: number, p: Titik) {
  if (n < 3) {
    return false;
  }

  let extreme = new Titik(INF, p.y);

  let count = 0,
    i = 0;
  do {
    let next = (i + 1) % n;


    if (doIntersect(polygon[i], polygon[next], p, extreme)) {
      if (orient(polygon[i], p, polygon[next]) == 0) {
        return onSegment(polygon[i], p,
          polygon[next]);
      }

      count++;
    }
    i = next;
  } while (i != 0);

  return (count % 2 == 1);
}

export function getArrOfTitiks(polygon: Array<number>) {
  var arr = [];
  for (var i = 0; i < polygon.length; i += 2) {
    arr.push(new Titik(polygon[i], polygon[i + 1]));
  }
  return arr;
}

export function isInline(A: Titik, B: Titik, C: Titik) {
  const errorDelta = 0.01;
  const dis1 = distance(A, B);
  const dis2 = distance(B, C);
  const dis3 = distance(A, C);
  return dis1 - errorDelta <= dis2 + dis3 &&
    dis2 + dis3 <= dis1 + errorDelta;
}

export function distance(A: Titik, B: Titik) {
  return Math.sqrt(Math.pow((A.x - B.x), 2) +
    Math.pow((A.y - B.y), 2));
}
