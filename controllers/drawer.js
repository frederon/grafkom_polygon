const triangleData = [
  0.0, 0.0,
  1.0, 0.0,
  0.0, 1.0
]

const bindVertex = (ctx) => {
  const vertBuf = ctx.createBuffer()
  ctx.bindBuffer(ctx.ARRAY_BUFFER, vertBuf)
  ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(triangleData), ctx.STATIC_DRAW)
}

const draw = (shaderProgram, ctx) => {
  ctx.useProgram(shaderProgram)
  const vertexPos = ctx.getAttribLocation(shaderProgram, 'a_pos')
  const uniformCol = ctx.getUniformLocation(shaderProgram, 'u_fragColor')
  ctx.vertexAttribPointer(vertexPos, 2, ctx.FLOAT, false, 0, 0)
  ctx.uniform4fv(uniformCol, [1.0, 0.0, 0.0, 1.0])
  ctx.enableVertexAttribArray(vertexPos)
  ctx.drawArrays(ctx.TRIANGLES, 0, triangleData.length / 2)
}

export {
  bindVertex,
  draw
}