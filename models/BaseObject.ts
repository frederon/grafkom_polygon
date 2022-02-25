import { ObjectType } from "../controllers/enums";

abstract class BaseObject {
  public vertices: Array<number>;
  public type!: ObjectType;
  public color!: [number, number, number, number]; //RGBA
  public projectionMatrix: Array<number>;

  constructor(vertices: Array<number>, color: [number, number, number, number]) {
    this.vertices = vertices;
    this.color = color;
    this.projectionMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1]
  }

  abstract draw(
    shaderProgram: WebGLProgram,
    ctx: WebGL2RenderingContext
  ): void;

  abstract getVertices(): Array<number>;
}

export default BaseObject;