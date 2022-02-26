import Line from "../models/Line";
import Point from "../models/Point";
import Polygon from "../models/Polygon";
import Rectangle from "../models/Rectangle";
import Square from "../models/Square";
import { Action } from "./enums";
import Loader from "./loader";
import { convertHexToRGB, getMousePosition } from "./utils";

class EventsLoader {
  private app: Loader;

  private isDrawing: boolean;
  private startVertex!: [number, number];

  private selectedColor!: [number, number, number, number];

  public action: Action = Action.DRAW_LINE;

  constructor(app: Loader) {
    this.app = app;
    this.isDrawing = false;

    this.app.canvas.addEventListener('mousedown', this.startDrawing);
    this.app.canvas.addEventListener('mouseup', this.endDrawing);
    this.app.canvas.addEventListener('mousemove', this.whileDrawing);

    this.setupActionButtons()
    this.setupColor()
    this.setupPolygon()

    // Request frame for smoother animation
    const requestAnimationFunction = (time: number) => {
      time *= 0.0001;
      this.app.clear();
      this.app.drawObjects();
      window.requestAnimationFrame(requestAnimationFunction);
    };
    window.requestAnimationFrame(requestAnimationFunction);
  }

  private startDrawing = (event: MouseEvent): void => {
    const [x, y] = getMousePosition(this.app.canvas, event);

    if (this.action === Action.DRAW_LINE) {
      this.isDrawing = true;
      this.startVertex = [x, y];
    } else if (this.action === Action.DRAW_RECTANGLE) {
      this.isDrawing = true;
      this.startVertex = [x, y];
    } else if (this.action === Action.DRAW_SQUARE) {
      this.isDrawing = true;
      this.startVertex = [x, y];
    } else if (this.action === Action.DRAW_POLYGON) {
      this.isDrawing = true;
      const point = new Point([x, y], this.selectedColor)
      if (this.app.tempObjects instanceof Array) {
        this.app.tempObjects.push(point)
      } else {
        this.app.tempObjects = [point]
        this.startVertex = [x, y]
      }
    }
  }

  private whileDrawing = (event: MouseEvent): void => {
    const [x, y] = getMousePosition(this.app.canvas, event)
    this.updateMousePosLabel(event)

    // Checks whether the user is draging or not
    if (this.isDrawing) {
      if (this.action === Action.DRAW_LINE) {
        const line = new Line([...this.startVertex, x, y], this.selectedColor)
        this.app.tempObjects = line;
      } else if (this.action === Action.DRAW_RECTANGLE) {
        const rectangle = new Rectangle(
          [...this.startVertex, x, this.startVertex[1], x, y, this.startVertex[0], y],
          this.selectedColor
        )
        this.app.tempObjects = rectangle;
      } else if (this.action === Action.DRAW_SQUARE) {
        const x1 = this.startVertex[0];
        const y1 = this.startVertex[1];
        const x2 = x;
        const y2 = y;

        const deltax = x2 - x1;

        let posY = y1;
        if (x2 > x1 && y2 > y1) {
          posY += deltax;
        } else {
          posY -= deltax;
        }

        if (x2 < x1 && y2 < y1) {
          posY += 2 * deltax;
        }

        const vertices = [x1, y1, x2, y1, x2, posY, x1, posY];

        const square = new Square(vertices, this.selectedColor)
        this.app.tempObjects = square;
      }
    }
  }

  private endDrawing = (event: MouseEvent): void => {
    const [x, y] = getMousePosition(this.app.canvas, event)

    if (this.action === Action.TRANSFORM) {
      console.log(this.app.getNearestObject(event));
    }

    if (this.action === Action.CHANGE_COLOR) {
      const obj = this.app.getNearestObject(event);
      if (obj) {
        obj.color = this.selectedColor;
        this.app.clear()
        this.app.drawObjects()
      }
    }

    // Checks whether the user is draging or not
    if (this.isDrawing) {
      if (this.action === Action.DRAW_LINE) {
        const line = new Line([...this.startVertex, x, y], this.selectedColor)
        this.app.objects.push(line);

        this.isDrawing = false;
      } else if (this.action === Action.DRAW_RECTANGLE) {
        const rectangle = new Rectangle(
          [...this.startVertex, x, this.startVertex[1], x, y, this.startVertex[0], y],
          this.selectedColor
        )
        this.app.objects.push(rectangle);

        this.isDrawing = false;
      } else if (this.action === Action.DRAW_SQUARE) {
        var x1 = this.startVertex[0];
        var y1 = this.startVertex[1];
        var x2 = x;
        var y2 = y;

        var deltax = x2 - x1;

        var posY = y1;
        if (x2 > x1 && y2 > y1) {
          posY += deltax;
        } else {
          posY -= deltax;
        }

        if (x2 < x1 && y2 < y1) {
          posY += 2 * deltax;
        }

        var vertices = [x1, y1, x2, y1, x2, posY, x1, posY];

        const square = new Square(vertices, this.selectedColor)
        this.app.objects.push(square);

        this.isDrawing = false;
      }
    }
  }

  private setupPolygon(): void {
    document.addEventListener('keyup', (event: KeyboardEvent) => {
      if (this.isDrawing && event.key === 'Enter' && this.action === Action.DRAW_POLYGON) {
        const points = this.app.tempObjects as Point[];
        if (points instanceof Array && points.length < 3) {
          alert('Polygon requires at least 3 points')
          this.app.tempObjects = null;
          return
        }

        const polygon = new Polygon(points, this.selectedColor)
        this.app.objects.push(polygon)

        this.app.tempObjects = null;
        this.isDrawing = false;
      }
    })
  }

  private setupActionButtons(): void {
    document.querySelector('#action-line')?.addEventListener('click', () => {
      this.action = Action.DRAW_LINE
    })
    document.querySelector('#action-square')?.addEventListener('click', () => {
      this.action = Action.DRAW_SQUARE
    })
    document.querySelector('#action-rectangle')?.addEventListener('click', () => {
      this.action = Action.DRAW_RECTANGLE
    })
    document.querySelector('#action-polygon')?.addEventListener('click', () => {
      this.action = Action.DRAW_POLYGON
    })
    document.querySelector('#action-transform')?.addEventListener('click', () => {
      this.action = Action.TRANSFORM
    })
    document.querySelector('#action-color')?.addEventListener('click', () => {
      this.action = Action.CHANGE_COLOR
    })
  }

  private setupColor(): void {
    const colorPicker = document.querySelector('#color') as HTMLInputElement;

    // set default value for color
    colorPicker.value = "#ff0000"
    this.selectedColor = [1, 0, 0, 1]

    colorPicker.addEventListener('change', () => {
      const result = convertHexToRGB(colorPicker.value)
      if (result) this.selectedColor = [...result, 1.0];
    })
  }

  private updateMousePosLabel(event: MouseEvent): void {
    const [x, y] = getMousePosition(this.app.canvas, event)

    const mouseX = document.querySelector('#mouse-pos-x') as HTMLInputElement
    mouseX.value = x.toFixed(3);

    const mouseY = document.querySelector('#mouse-pos-y') as HTMLInputElement
    mouseY.value = y.toFixed(3);
  }
}

export default EventsLoader;