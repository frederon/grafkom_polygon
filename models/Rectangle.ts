import { ObjectType } from "../controllers/enums";
import BaseObject from "./BaseObject";

class Rectangle extends BaseObject {

  constructor(
    vertices: Array<number>,
    color: [number, number, number, number]
  ) {
    super(vertices, color);
    this.type = ObjectType.RECTANGLE;
  }

  public draw(
    shaderProgram: WebGLProgram,
    ctx: WebGL2RenderingContext
  ) {
    const vertBuf = ctx.createBuffer()
    ctx.bindBuffer(ctx.ARRAY_BUFFER, vertBuf)
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(this.vertices), ctx.STATIC_DRAW)

    ctx.useProgram(shaderProgram)
    const vertexPos = ctx.getAttribLocation(shaderProgram, 'a_pos')
    const uniformCol = ctx.getUniformLocation(shaderProgram, 'u_fragColor')
    const projPos = ctx.getUniformLocation(
      shaderProgram, 'u_projMatrix'
    )
    ctx.vertexAttribPointer(vertexPos, 2, ctx.FLOAT, false, 0, 0)
    ctx.uniformMatrix3fv(projPos, false, this.projectionMatrix);
    ctx.uniform4fv(uniformCol, this.color)
    ctx.enableVertexAttribArray(vertexPos)

    ctx.drawArrays(ctx.TRIANGLE_FAN, 0, 4)
  }

  public move(
    point: number,
    target: [number, number]
  ) {
    if (point < 0 || point >= 4) return
    const frontPoint = (point + 2) % 4;
    const staticPoint = [this.vertices[frontPoint * 2], this.vertices[frontPoint * 2 + 1]] // front point

    this.vertices = [
      ...staticPoint,
      target[0],
      staticPoint[1],
      ...target,
      staticPoint[0],
      target[1]
    ]
  }
}

export default Rectangle;