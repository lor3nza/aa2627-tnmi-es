// E0. Forme geometriche reattive
//
// Obiettivo: comporre alcune forme geometriche semplici e far dipendere
// dalla posizione del mouse almeno un loro parametro.
//
// Vincoli:
// - usare p5.js (versione 2), senza altre librerie;
// - comporre alcune forme geometriche semplici, con un accostamento
//   che regga anche da fermo;
// - almeno un parametro delle forme (dimensione, colore, rotazione o
//   distanza fra gli elementi) deve dipendere dalla posizione del mouse;
// - procedere con l'agente, verificando ogni passaggio nel browser;
// - leggere il codice e farsi spiegare le parti non chiare.

// dimensioni della tela
const larghezzaTela = 800;
const altezzaTela = 600;

// griglia di cerchi: quante colonne e quante righe
const colonne = 10;
const righe = 7;

// raggio del cerchio lontano dal mouse e raggio del cerchio sotto il mouse
const raggioMinimo = 5;
const raggioMassimo = 34;

// entro questa distanza dal mouse i cerchi iniziano a ingrandirsi
const raggioInfluenza = 260;

// oltre questa vicinanza al mouse il cerchio diventa ottagono
// (0 = solo sotto il mouse, 1 = anche i più lontani)
const sogliaOttagono = 0.55;

// colore quando il mouse è in alto e colore quando è in basso
const coloreAlto = [70, 40, 150];
const coloreBasso = [240, 150, 60];

// margine tra i bordi della tela e la griglia
const margine = 70;

function setup() {
  createCanvas(larghezzaTela, altezzaTela);
  noStroke();
}

function draw() {
  background(245);

  // quanto il mouse è in basso: 0 in alto, 1 in basso
  const versoBasso = constrain(mouseY / altezzaTela, 0, 1);

  // il colore dei cerchi passa gradualmente fra i due colori
  fill(lerpColor(color(coloreAlto), color(coloreBasso), versoBasso));

  // spazio disponibile per la griglia, dentro i margini
  const larghezzaGriglia = larghezzaTela - margine * 2;
  const altezzaGriglia = altezzaTela - margine * 2;

  for (let i = 0; i < colonne; i++) {
    for (let j = 0; j < righe; j++) {
      // posizione del cerchio nella griglia
      const x = margine + (larghezzaGriglia * (i + 0.5)) / colonne;
      const y = margine + (altezzaGriglia * (j + 0.5)) / righe;

      // vicinanza al mouse: 1 sotto il mouse, 0 oltre il raggio d'influenza
      const distanza = dist(mouseX, mouseY, x, y);
      const vicinanza = constrain(1 - distanza / raggioInfluenza, 0, 1);

      // il raggio cresce avvicinandosi al mouse
      const raggio = lerp(raggioMinimo, raggioMassimo, vicinanza);

      // i cerchi vicini al mouse diventano ottagoni, gli altri restano cerchi
      if (vicinanza > sogliaOttagono) {
        ottagono(x, y, raggio);
      } else {
        circle(x, y, raggio * 2);
      }
    }
  }
}

// disegna un ottagono centrato in (cx, cy) con il raggio dato
function ottagono(cx, cy, raggio) {
  const lati = 8;
  const passo = TWO_PI / lati;
  beginShape();
  for (let k = 0; k < lati; k++) {
    // il mezzo passo iniziale appoggia l'ottagono con un lato piatto in alto
    const angolo = k * passo + passo / 2;
    vertex(cx + cos(angolo) * raggio, cy + sin(angolo) * raggio);
  }
  endShape(CLOSE);
}
