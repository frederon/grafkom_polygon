import vertShaderData from "../shaders/vertex_shader.glsl"
import fragShaderData from "../shaders/fragment_shader.glsl"
import BaseObject from "../models/BaseObject";
import Line from "../models/Line";
import Rectangle from "../models/Rectangle";
import { isInside, isInline, getMousePosition, getArrOfCoordinates, Coordinate, distance } from "./utils";
import { ObjectType } from "./enums";
import Polygon from "../models/Polygon";
import Point from "../models/Point";

class Loader {
  public canvas!: HTMLCanvasElement;
  public ctx!: WebGL2RenderingContext;

  public shaderProgram!: WebGLProgram;
  private vertexShader!: WebGLShader;
  private fragmentShader!: WebGLShader;

  public objects: Array<BaseObject> = [];
  public tempObjects: BaseObject | Array<BaseObject> | null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('webgl2') as WebGL2RenderingContext;

    this.objects = [];
    this.tempObjects = null;

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

  public drawObjects = (): void => {
    for (const obj of this.objects) {
      if (!obj.isTransforming) {
        obj.draw(this.shaderProgram, this.ctx);
      }
    }

    if (this.tempObjects && this.tempObjects instanceof BaseObject) {
      this.tempObjects.draw(this.shaderProgram, this.ctx);
    } else if (this.tempObjects && this.tempObjects instanceof Array) {
      for (const obj of this.tempObjects) {
        obj.draw(this.shaderProgram, this.ctx);
      }
    }
  }

  public getNearestInsideObject = (event: MouseEvent): BaseObject | null => {
    for (let i: number = 0; i < this.objects.length; i++) {
      if (this.objects[i].type === ObjectType.LINE) {
        let vertices = this.objects[i].vertices;
        let pos = getMousePosition(this.canvas, event);
        let p1 = [vertices[0], vertices[1]] as Coordinate
        let p2 = [vertices[2], vertices[3]] as Coordinate
        let p3 = [pos[0], pos[1]] as Coordinate
        if (isInline(p1, p2, p3)) {
          return this.objects[i];
        }
      } else {
        let vertices = this.objects[i].vertices;
        let pos = getMousePosition(this.canvas, event);
        let arrayOfPoints = getArrOfCoordinates(vertices);
        let p3 = [pos[0], pos[1]] as Coordinate;
        if (isInside(arrayOfPoints, arrayOfPoints.length, p3)) {
          return this.objects[i];
        }
      }
    }
    return null;
  }

  public getNearestObjectByPoint(x: number, y: number, treshold: number): BaseObject | null {
    for (const obj of this.objects) {
      const vertices = obj.type === ObjectType.POLYGON ?
        (obj as Polygon).getVertices() : obj.vertices;
      const coor = getArrOfCoordinates(vertices);
      for (const c of coor) {
        const dist = distance([x, y], [c[0], c[1]])
        if (dist <= treshold) {
          return obj
        }
      }
    }
    return null;
  }
}

export default Loader;