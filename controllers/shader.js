const getShaders = (ctx, glslType, glslData) => {
  if (!ctx) {
    alert('Your browser does not support WebGL')
  }

  const type = glslType === 'vertex' ? ctx.VERTEX_SHADER : ctx.FRAGMENT_SHADER

  const shader = ctx.createShader(type)
  ctx.shaderSource(shader, glslData)
  ctx.compileShader(shader)
  return shader
}

export default getShaders;