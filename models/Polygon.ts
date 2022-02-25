import { ObjectType } from "../controllers/enums";
import BaseObject from "./BaseObject";
import Point from "./Point";

class Polygon extends BaseObject {
  public points: Array<Point>;

  constructor(
    points: Array<Point>,
    color: [number, number, number, number]
  ) {
    super(color);
    this.type = ObjectType.POLYGON;
    this.points = points;
  }

  private drawTriangle(
    vertices: Array<number>,
    shaderProgram: WebGLProgram,
    ctx: WebGL2RenderingContext
  ) {
    const vertBuf = ctx.createBuffer()
    ctx.bindBuffer(ctx.ARRAY_BUFFER, vertBuf)
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(vertices), ctx.STATIC_DRAW)

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

    ctx.drawArrays(ctx.TRIANGLES, 0, 3)
  }

  public draw(
    shaderProgram: WebGLProgram,
    ctx: WebGL2RenderingContext
  ) {
    const startPoint = this.points[0]
    for (let i = 1; i < this.points.length - 1; i += 1) {
      this.drawTriangle([
        startPoint?.vertices[0]!, startPoint?.vertices[1]!,
        this.points[i].vertices[0], this.points[i].vertices[1],
        this.points[i + 1].vertices[0], this.points[i + 1].vertices[1],
      ], shaderProgram, ctx)
    }
  }
}

export default Polygon;