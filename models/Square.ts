import BaseObject from "./BaseObject";
import { ObjectType } from "../controllers/enums";

class Square extends BaseObject {
    private vertices: Array<number>;

    constructor(id: number, vertices: Array<number>) {
        super(id);
        this.type = ObjectType.SQUARE;
        this.vertices = vertices;
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
}

export default Square;