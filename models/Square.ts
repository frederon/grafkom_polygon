import BaseObject from "./BaseObject";
import { ObjectType } from "../controllers/enums";

class Square extends BaseObject {

    constructor(
        vertices: Array<number>,
        color: [number, number, number, number]
    ) {
        super(vertices, color);
        this.type = ObjectType.SQUARE;
    }


    draw(shaderProgram: WebGLProgram, ctx: WebGL2RenderingContext) {
        const vertBuf = ctx.createBuffer();
        ctx.bindBuffer(ctx.ARRAY_BUFFER, vertBuf);
        ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(this.vertices), ctx.STATIC_DRAW);

        ctx.useProgram(shaderProgram);
        const vertexPos = ctx.getAttribLocation(shaderProgram, 'a_pos');
        const uniformCol = ctx.getUniformLocation(shaderProgram, 'u_fragColor');
        const projPos = ctx.getUniformLocation(shaderProgram, 'u_projMatrix');

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
        const frontPoint = (point + 2) % 4;

        const x1 = this.vertices[frontPoint * 2];
        const y1 = this.vertices[frontPoint * 2 + 1];
        let x2 = target[0];
        let y2 = target[1];

        const distx = Math.abs(x1 - x2);
        const disty = Math.abs(y1 - y2);

        const mulx = x2 < x1 ? -1 : 1;
        const muly = y2 < y1 ? -1 : 1;

        const minDist = distx < disty ? distx : disty;
        x2 = x1 + mulx * minDist;
        y2 = y1 + muly * minDist;

        this.vertices = [x1, y1, x2, y1, x2, y2, x1, y2];
    }
}

export default Square;