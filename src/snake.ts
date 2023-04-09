type Props = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type Direction = "up" | "down" | "left" | "right";

export class Snake {
  private x: number = 0;
  private y: number = 0;
  private w: number = 0;
  private h: number = 0;

  private dir: Direction;
  private t: number = 0;

  constructor({ x, y, w, h }: Props) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.dir = "right";
  }

  restart(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  set direction(d: Direction) {
    if (this.dir === "up" && d === "down") return;
    if (this.dir === "down" && d === "up") return;
    if (this.dir === "left" && d === "right") return;
    if (this.dir === "right" && d === "left") return;
    this.dir = d;
  }

  willColide() {
    if (this.y >= this.h) return true;
    if (this.y < 0) return true;
    if (this.x >= this.w) return true;
    if (this.x < 0) return true;

    return false;
  }

  move() {
    switch (this.dir) {
      case "up":
        this.y -= 1;
        break;
      case "down":
        this.y += 1;
        break;
      case "right":
        this.x += 1;
        break;
      case "left":
        this.x -= 1;
        break;
      default:
        break;
    }

    return { x: this.x, y: this.y };
  }

  get position(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  increaseTail() {
    this.t++;
  }

  get tail() {
    return this.t;
  }
}
