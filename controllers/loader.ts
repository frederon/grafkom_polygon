import vertShaderData from "../shaders/vertex_shader.glsl"
import fragShaderData from "../shaders/fragment_shader.glsl"
import BaseObject from "../models/BaseObject";

class Loader {
  public canvas!: HTMLCanvasElement;
  public ctx!: WebGL2RenderingContext;

  public shaderProgram!: WebGLProgram;
  private vertexShader!: WebGLShader;
  private fragmentShader!: WebGLShader;

  public objects!: Array<BaseObject>;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('webgl2') as WebGL2RenderingContext;

    if (!this.ctx) {
      alert('Your browser does not support WebGL')
    }

    this.vertexShader = this.loadShaders('vertex', vertShaderData);
    this.fragmentShader = this.loadShaders('fragment', fragShaderData);
    this.loadProgram();

    this.clear();
  }

  public loadShaders = (glslType: string, glslData: string): WebGLShader => {
    const type = glslType === 'vertex' ?
      this.ctx.VERTEX_SHADER : this.ctx.FRAGMENT_SHADER

    const shader = this.ctx.createShader(type) as WebGLShader
    this.ctx.shaderSource(shader, glslData)
    this.ctx.compileShader(shader)

    if (!this.ctx.getShaderParameter(shader, this.ctx.COMPILE_STATUS)) {
      alert(this.ctx.getShaderInfoLog(shader));
      this.ctx.deleteShader(shader);
    }

    return shader
  }

  public loadProgram = (): void => {
    this.shaderProgram = this.ctx.createProgram() as WebGLProgram;

    this.ctx.attachShader(this.shaderProgram, this.vertexShader);
    this.ctx.attachShader(this.shaderProgram, this.fragmentShader);

    this.ctx.linkProgram(this.shaderProgram);

    if (!this.ctx.getProgramParameter(this.shaderProgram, this.ctx.LINK_STATUS)) {
      alert("WebGL Program error");
      this.ctx.deleteProgram(this.shaderProgram);
    }
  }

  public clear = (): void => {
    this.ctx.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.clearColor(1, 1, 1, 1);
    this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT)
  }
}

export default Loader;