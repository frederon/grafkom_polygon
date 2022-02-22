import { bindVertex, draw } from "./controllers/drawer"
import Loader from "./controllers/loader"

const canvas = document.getElementById("webgl")
canvas.width = 800
canvas.height = 600

const app = new Loader(canvas);

bindVertex(app.ctx)
draw(app.shaderProgram, app.ctx)
