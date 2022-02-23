import { ObjectType } from "../controllers/enums";

abstract class BaseObject {
  public id: number;
  public type!: ObjectType;
  public color!: [number, number, number, number]; //RGBA
  public projectionMatrix: Array<number>;

  constructor(
    id: number
  ) {
    this.id = id;
    this.color = [1.0, 0.0, 0.0, 1.0]
    this.projectionMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1]
  }

  abstract draw(
    shaderProgram: WebGLProgram,
    ctx: WebGL2RenderingContext
  ): void;
}

export default BaseObject;