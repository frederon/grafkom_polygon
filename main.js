import Loader from "./controllers/loader"
import Line from "./models/Line"

const canvas = document.getElementById("webgl")
canvas.width = 800
canvas.height = 600

const app = new Loader(canvas);

const line = new Line(1, [1, 0, 0, 1])
line.draw(app.shaderProgram, app.ctx)
