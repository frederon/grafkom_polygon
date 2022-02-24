import { ObjectType } from "../controllers/enums";

abstract class BaseObject {
  public type!: ObjectType;
  public color!: [number, number, number, number]; //RGBA
  public projectionMatrix: Array<number>;

  constructor(color: [number, number, number, number]) {
    this.color = color;
    this.projectionMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1]
  }

  abstract draw(
    shaderProgram: WebGLProgram,
    ctx: WebGL2RenderingContext
  ): void;
}

export default BaseObject;