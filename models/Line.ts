import { ObjectType } from "../controllers/enums";
import BaseObject from "./BaseObject";

class Line extends BaseObject {

  constructor(
    vertices: Array<number>,
    color: [number, number, number, number]
  ) {
    super(vertices, color);
    this.type = ObjectType.LINE;
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

    ctx.drawArrays(ctx.LINES, 0, 2)
  }

  public move(
    point: number,
    target: [number, number]
  ) {
    if (point < 0 || point >= 2) return
    this.vertices[point * 2] = target[0]
    this.vertices[point * 2 + 1] = target[1]
  }
}

export default Line;