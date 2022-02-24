import BaseObject from "../models/BaseObject";
import Line from "../models/Line";
import Rectangle from "../models/Rectangle";
import Square from "../models/Square";
import { Action } from "./enums";
import Loader from "./loader";
import { convertHexToRGB } from "./utils";

class EventsLoader {
  private app: Loader;

  private isDrawing: boolean;
  private startVertex!: [number, number];
  private tempObj!: BaseObject;

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

    // Request frame for smoother animation
    const requestAnimationFunction = (time: number) => {
      time *= 0.0001;
      this.app.clear();
      this.app.drawObjects();
      window.requestAnimationFrame(requestAnimationFunction);
    };
    window.requestAnimationFrame(requestAnimationFunction);
  }

  private getMousePosition = (event: MouseEvent): [number, number] => {
    const bounding = this.app.canvas.getBoundingClientRect();
    const x = 2 * ((event.x - bounding.left) / bounding.width) - 1;
    const y = -2 * ((event.y - bounding.top) / bounding.height) + 1;
    return [x, y]
  }

  private startDrawing = (event: MouseEvent) => {
    const [x, y] = this.getMousePosition(event);

    if (this.action === Action.DRAW_LINE) {
      this.isDrawing = true;
      this.startVertex = [x, y];
    } else if (this.action === Action.DRAW_RECTANGLE) {
      this.isDrawing = true;
      this.startVertex = [x, y];
    } else if (this.action === Action.DRAW_SQUARE) {
      this.isDrawing = true;
      this.startVertex = [x, y];
    }
  }

  private whileDrawing = (event: MouseEvent) => {
    const [x, y] = this.getMousePosition(event);
    this.updateMousePosLabel(event)

    // Checks whether the user is draging or not
    if (this.isDrawing) {
      if (this.action === Action.DRAW_LINE) {
        const line = new Line([...this.startVertex, x, y], this.selectedColor)
        this.app.tempObject = line;
      } else if (this.action === Action.DRAW_RECTANGLE) {
        const rectangle = new Rectangle(
          [...this.startVertex, x, this.startVertex[1], this.startVertex[0], y, x, y],
          this.selectedColor
        )
        this.app.tempObject = rectangle;
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
        this.app.tempObject = square;
      }
    }
  }

  private endDrawing = (event: MouseEvent) => {
    const [x, y] = this.getMousePosition(event);

    // Checks whether the user is draging or not
    if (this.isDrawing) {
      if (this.action === Action.DRAW_LINE) {
        const line = new Line([...this.startVertex, x, y], this.selectedColor)
        this.app.objects.push(line);

        this.isDrawing = false;
      } else if (this.action === Action.DRAW_RECTANGLE) {
        const rectangle = new Rectangle(
          [...this.startVertex, x, this.startVertex[1], this.startVertex[0], y, x, y],
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

  private setupActionButtons() {
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

  private setupColor() {
    const colorPicker = document.querySelector('#color') as HTMLInputElement;

    // set default value for color
    colorPicker.value = "#ff0000"
    this.selectedColor = [1, 0, 0, 1]

    colorPicker.addEventListener('change', () => {
      const result = convertHexToRGB(colorPicker.value)
      if (result) this.selectedColor = [...result, 1.0];
    })
  }

  private updateMousePosLabel(event: MouseEvent) {
    const [x, y] = this.getMousePosition(event);

    const mouseX = document.querySelector('#mouse-pos-x') as HTMLInputElement
    mouseX.value = x.toFixed(3);

    const mouseY = document.querySelector('#mouse-pos-y') as HTMLInputElement
    mouseY.value = y.toFixed(3);
  }
}

export default EventsLoader;