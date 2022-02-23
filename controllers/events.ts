import Line from "../models/Line";
import { Action } from "./enums";
import Loader from "./loader";

class EventsLoader {
  private app: Loader;

  private isDrawing: boolean;
  private startVertex!: [number, number];

  public action: Action = Action.DRAW_LINE;

  constructor(app: Loader) {
    this.app = app;
    this.isDrawing = false;

    this.app.canvas.addEventListener('mousedown', this.startDrawing);
    this.app.canvas.addEventListener('mouseup', this.endDrawing);
  }

  private getMousePosition = (event: MouseEvent): [number, number] => {
    const bounding = this.app.canvas.getBoundingClientRect();
    const x = 2 * ((event.x - bounding.left) / bounding.width) - 1;
    const y = -2 * ((event.y - bounding.top) / bounding.height) + 1;
    return [x, y]
  }

  private startDrawing = (event: MouseEvent) => {
    console.log("start drawing")
    const [x, y] = this.getMousePosition(event);

    if (this.action === Action.DRAW_LINE) {
      this.isDrawing = true;
      this.startVertex = [x, y];
    }
  }

  private whileDrawing = (event: MouseEvent) => {
    const [x, y] = this.getMousePosition(event);

    // Checks whether the user is draging or not
    if (this.isDrawing) {
      if (this.action === Action.DRAW_LINE) {
        const line = new Line(1, [...this.startVertex, x, y])
        line.draw(this.app.shaderProgram, this.app.ctx);
      }
    }
  }

  private endDrawing = (event: MouseEvent) => {
    const [x, y] = this.getMousePosition(event);

    // Checks whether the user is draging or not
    if (this.isDrawing) {
      if (this.action === Action.DRAW_LINE) {
        const line = new Line(1, [...this.startVertex, x, y])
        line.draw(this.app.shaderProgram, this.app.ctx);
        this.isDrawing = false;
      }
    }
  }
}

export default EventsLoader;