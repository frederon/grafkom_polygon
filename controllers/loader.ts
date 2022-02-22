import vertShaderData from "../shaders/vertex_shader.glsl"
import fragShaderData from "../shaders/fragment_shader.glsl"

class Loader {
  private canvas!: HTMLCanvasElement;
  public ctx!: WebGL2RenderingContext;

  public shaderProgram!: WebGLProgram;
  private vertexShader!: WebGLShader;
  private fragmentShader!: WebGLShader;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('webgl2') as WebGL2RenderingContext;

    if (!this.ctx) {
      alert('Your browser does not support WebGL')
    }

    this.vertexShader = this.loadShaders('vertex', vertShaderData);
    this.fragmentShader = this.loadShaders('fragment', fragShaderData);
    this.loadProgram();
  }

  public loadShaders = (glslType: string, glslData: string): WebGLShader => {
    const type = glslType === 'vertex' ?
      this.ctx.VERTEX_SHADER : this.ctx.FRAGMENT_SHADER

    const shader = this.ctx.createShader(type) as WebGLShader
    this.ctx.shaderSource(shader, glslData)
    this.ctx.compileShader(shader)
    return shader
  }

  public loadProgram = (): void => {
    this.shaderProgram = this.ctx.createProgram() as WebGLProgram;

    this.ctx.attachShader(this.shaderProgram, this.vertexShader);
    this.ctx.attachShader(this.shaderProgram, this.fragmentShader);

    this.ctx.linkProgram(this.shaderProgram);
  }
}

export default Loader;