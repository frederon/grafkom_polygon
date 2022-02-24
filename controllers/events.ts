import BaseObject from "../models/BaseObject";
import Line from "../models/Line";
import Rectangle from "../models/Rectangle";
import Square from "../models/Square";
import { Action } from "./enums";
import Loader from "./loader";

class EventsLoader {
  private app: Loader;

  private isDrawing: boolean;
  private startVertex!: [number, number];
  private tempObj!: BaseObject;

  public action: Action = Action.DRAW_LINE;

  constructor(app: Loader) {
    this.app = app;
    this.isDrawing = false;

    this.app.canvas.addEventListener('mousedown', this.startDrawing);
    this.app.canvas.addEventListener('mouseup', this.endDrawing);
    this.app.canvas.addEventListener('mousemove', this.whileDrawing);

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
    console.log("move")
    const [x, y] = this.getMousePosition(event);

    // Checks whether the user is draging or not
    if (this.isDrawing) {
      if (this.action === Action.DRAW_LINE) {
        const line = new Line(1, [...this.startVertex, x, y])
        this.app.tempObject = line;
      } else if (this.action === Action.DRAW_RECTANGLE) {
        const rectangle = new Rectangle(1, [...this.startVertex, x, this.startVertex[1], this.startVertex[0], y, x, y])
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

        const square = new Square(1, vertices)
        this.app.tempObject = square;
      }
    }
  }

  private endDrawing = (event: MouseEvent) => {
    const [x, y] = this.getMousePosition(event);

    // Checks whether the user is draging or not
    if (this.isDrawing) {
      if (this.action === Action.DRAW_LINE) {
        const line = new Line(1, [...this.startVertex, x, y])
        this.app.objects.push(line);

        this.isDrawing = false;
      } else if (this.action === Action.DRAW_RECTANGLE) {
        const rectangle = new Rectangle(1, [...this.startVertex, x, this.startVertex[1], this.startVertex[0], y, x, y])
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

        const square = new Square(1, vertices)
        this.app.objects.push(square);

        this.isDrawing = false;
      }
    }
  }
}

export default EventsLoader;