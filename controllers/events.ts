class EventsLoader {
  constructor(canvas: HTMLCanvasElement) {
    canvas.addEventListener('mousedown', this.startDrawing);
    canvas.addEventListener('mouseup', this.endDrawing);
  }

  private startDrawing = () => {

  }

  private endDrawing = () => {

  }
}

export default EventsLoader;