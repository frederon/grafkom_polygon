import { bindVertex, draw } from "./controllers/drawer"
import load from "./controllers/loader"

const canvas = document.getElementById("webgl")
canvas.width = 800
canvas.height = 600

const ctx = canvas.getContext('webgl2')
const shaderProgram = load(ctx)

bindVertex(ctx)
draw(shaderProgram, ctx)
