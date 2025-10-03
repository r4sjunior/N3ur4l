let particles = [];
let reggaeColors;
let isSaving = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  reggaeColors = [
    color(255, 0, 0),   // Vermelho
    color(255, 204, 0), // Amarelo
    color(0, 204, 0)    // Verde
  ];

  for (let i = 0; i < 300; i++) {
    particles.push(new Particle(random(width), random(height)));
  }

  strokeWeight(1);
  noCursor();
}

function draw() {
  background(5, 10, 20, 40);

  for (let p of particles) {
    p.update();
    p.display();
    p.connect(particles);
  }
}

// ⬇️ Função para salvar GIF ao pressionar 'S'
function keyPressed() {
  if (key === 's' || key === 'S') {
    isSaving = true;
    console.log("Iniciando gravação do GIF...");
    saveGif('reggae-constellation', 6, 120).then(() => {
      isSaving = false;
      console.log("GIF salvo com sucesso.");
    });
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 1.2));
    this.radius = random(2, 4);
    this.col = random(reggaeColors);
  }

  update() {
    this.pos.add(this.vel);

    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;

    let mouse = createVector(mouseX, mouseY);
    let dir = p5.Vector.sub(this.pos, mouse);
    let d = dir.mag();
    if (d < 120) {
      dir.setMag(0.3);
      this.pos.add(dir);
    }
  }

  display() {
    noStroke();
    fill(this.col);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }

  connect(others) {
    for (let other of others) {
      let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
      if (d < 100) {
        let blendColor = lerpColor(this.col, other.col, 0.5);
        stroke(blendColor.levels[0], blendColor.levels[1], blendColor.levels[2], map(d, 0, 100, 200, 0));
        line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
      }
    }
  }
}
