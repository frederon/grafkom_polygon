import EventsLoader from "./controllers/events";
import Loader from "./controllers/loader"
import Line from "./models/Line"

const canvas = document.getElementById("webgl") as HTMLCanvasElement;
canvas.width = 800
canvas.height = 600

const app = new Loader(canvas);
new EventsLoader(app);

// const line = new Line(1, [1, 0, 0, 1])
// line.draw(app.shaderProgram, app.ctx)
