import { ObjectType } from "../controllers/enums";

abstract class BaseObject {
  public type!: ObjectType;
  public color!: [number, number, number, number]; //RGBA
  public vertices: Array<number>;
  public projectionMatrix: Array<number>;

  public isTransforming: boolean = false;

  constructor(vertices: Array<number>, color: [number, number, number, number]) {
    this.vertices = vertices;
    this.color = color;
    this.projectionMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1]
  }

  abstract draw(
    shaderProgram: WebGLProgram,
    ctx: WebGL2RenderingContext
  ): void;

  abstract move(
    origin: [number, number],
    target: [number, number],
    treshold: number
  ): void;
}

export default BaseObject;