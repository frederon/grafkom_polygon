import getShaders from "./shader"
import vertShaderData from "../shaders/vertex_shader.glsl"
import fragShaderData from "../shaders/fragment_shader.glsl"

function load(ctx) {
  const shaderProgram = ctx.createProgram()

  const vertShader = getShaders(ctx, 'vertex', vertShaderData)
  const fragShader = getShaders(ctx, 'fragment', fragShaderData)

  ctx.attachShader(shaderProgram, vertShader)
  ctx.attachShader(shaderProgram, fragShader)
  ctx.linkProgram(shaderProgram)

  return shaderProgram
}

export default load;