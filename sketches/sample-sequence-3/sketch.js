function setup() {
  createCanvas(200, 200, WEBGL);
}

function draw() {
  background(255);
  lights();
  noStroke();
  orbitControl();

  // The head
  push();
  scale(1, 1.25, 1);
  sphere(50);
  pop();

  // The nose
  push();
  translate(0, 0, 50);
  scale(1, 1.5, 1);
  sphere(10);
  pop();

  // Draw symmetrical parts by looping over each
  // side, represented by the horizontal scale applied.
  for (let side of [-1, 1]) {
    push();
    // Apply the symmetrical transformation
    scale(side, 1, 1);

    // Eyes
    push();
    translate(20, -10, 40);
    sphere(8);
    pop();

    // Ears
    push();
    translate(50, 0, 0);
    scale(1, 1, 0.3);
    sphere(20);
    pop();

    pop();
  }
}
