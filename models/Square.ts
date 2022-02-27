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
        console.log("before", this.vertices)
        console.log(point)
        const frontPoint = (point + 2) % 4;
        console.log(frontPoint)
        const x1 = this.vertices[frontPoint * 2];
        const y1 = this.vertices[frontPoint * 2 + 1];
        console.log(x1, y1)
        const x2 = target[0];
        const y2 = target[1];
        console.log(x2, y2)

        const deltax = x2 - x1;

        let posY = y1;
        if (x2 > x1 && y2 > y1) {
            posY += deltax;
        } else {
            posY -= deltax;
        }

        if (x2 < x1 && y2 < y1) {
            posY += 2 * deltax;
        }

        const vertices = [x1, y1, x2, y1, x2, posY, x1, posY];
        this.vertices = vertices;
        console.log("after", this.vertices)
    }
}

export default Square;