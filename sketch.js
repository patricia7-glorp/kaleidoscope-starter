// Change these values, save, and try drawing again.
let brushSize = 35;
let ink = "#000000";
let segments = 50;
let kaleidoAngle = 0;
let autoMode = false;
let autoSpeed = 0.8;
let autoDistance = 150;
let autoShapeSize = 40;

function setup() {
  //canvas o fill available space in the window
  createCanvas(720, 720);
  background(255, 122, 200);
  strokeCap(SQUARE);
  angleMode(DEGREES);
}

function mousePressed() {
  // Pick a brand-new color at the start of a drag and keep it until the press ends.
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    ink = color(random(255), random(255), random(255));
  }
}

function draw() {
  if (autoMode) {
    background(255, 122, 210);
    kaleidoAngle += autoSpeed;

    push();
    translate(width / 2, height / 2);
    rotate(kaleidoAngle);
    stroke(ink);
    strokeWeight(brushSize * 0.35);

    for (let i = 0; i < segments; i++) {
      push();
      rotate(i * (360 / segments));

      // repeated geometric shape around the centre
      const x = autoDistance;
      const y = 0;
      const s = autoShapeSize;

      push();
      translate(x, y);
      rotate(i * 2 + kaleidoAngle * 0.5);
      triangle(-s, s, 0, -s, s, s);
      pop();

      push();
      scale(-1, 1);
      translate(x, y);
      rotate(i * 2 + kaleidoAngle * 0.5);
      triangle(-s, s, 0, -s, s, s);
      pop();

      pop();
    }

    pop();
    return;
  }

  background(255, 122, 200, 3); // semi-transparent background for a fading effect

  if (mouseIsPressed && mouseX >= 0 && mouseX < width &&
      mouseY >= 0 && mouseY < height &&
      pmouseX >= 0 && pmouseX < width &&
      pmouseY >= 0 && pmouseY < height) {
    const cx = width / 2;
    const cy = height / 2;

    // Convert the stroke coordinates to the canvas centre as the new origin.
    const currentX = mouseX - cx;
    const currentY = mouseY - cy;
    const previousX = pmouseX - cx;
    const previousY = pmouseY - cy;

    push();
    translate(cx, cy);
    stroke(ink);
    strokeWeight(brushSize);

    for (let i = 0; i < segments; i++) {
      push();
      rotate(i * (360 / segments));

      // Original copy in this segment
      line(previousX, previousY, currentX, currentY);

      // Reflected copy in the same segment
      push();
      scale(-1, 1);
      line(previousX, previousY, currentX, currentY);
      pop();

      pop();
    }

    pop();
  }
}

function keyPressed() {
  if (key === 'a' || key === 'A') {
    autoMode = !autoMode;
    background(255, 122, 200);
    kaleidoAngle = 0;
  }

  if (key === 'c' || key === 'C') {
    background(12, 15, 24);
  }
  if (key === 's' || key === 'S') {
    saveCanvas('my-kaleidoscope', 'png');
  }
}
