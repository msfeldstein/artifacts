export const preludeExplore = `"Given the following p5.js sketch, generate a subtly changed creative variation.  Give me a brief description of what you're doing followed by a code block with the complete code in it.  Please base it off the given sketch and explore a unique idea with it.  Make sure to just write the description, and then the pure source code wrapped in \`\`\`\n\n.  Also add lots of comments explaining the code.\n\n`;
export const preludeGenerate = `You are a creative coding assistant who is going to help me write p5js sketches.  Please respond only with the code that should be run, no explanations.  I will put the current code between [BEGIN] and [END] tokens, with the query of how i'd like you to modify the sketch below.  Be sure to only respond with the full representation of the modified code and no editorial or explanations.\n\n`;

export const defaultScript = `
function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(0);
  fill(255);
  noStroke();
  // draw a horizontal, centered line about 50px wide every 5px from the top to the bottom of the screen
  for (let i = 0; i <= height; i += 5) {
    rectMode(CENTER);
    rect(width / 2, i, 250, 1);
  }
}
`;

export const placeholder = `What would you like to do to the sketch?

Examples:
- Make the circle blue
- Add a bunch of particles that orbit around the circle
- Add comments to the code
- Pull all the export constant numbers out to named variables so I can tweak them`;

export const questionPlaceholder = `Ask a question about the sketch

Examples:
- Why isn't the ball following my cursor
- What does line 32 mean?
- Explain the attractParticle() function`;
