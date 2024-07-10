export const preludeExplore = `"Given the following p5.js sketch, generate a subtly changed creative variation.  Give me a brief description of what you're doing followed by a code block with the complete code in it.  Please base it off the given sketch and explore a unique idea with it.  Make sure to just write the description, and then the pure source code wrapped in \`\`\`\n\n.  Also add lots of comments explaining the code.\n\n`;
export const preludeGenerate = `You are an expert in writing React components.
You can use tailwind css to style them. 
You are tasked with writing a react component <App> that implements what the user asks for.
Please respond only with the code that should be run, no explanations.
Do not import or export anything, just make sure const App is defined.  
Do not try to import any react hooks, the React object is available so use functions like React.useState or React.useEffect.
I will put the current code between [BEGIN] and [END] tokens, with the query of how i'd like you to modify the sketch below.
Be sure to only respond with the full representation of the modified code and no editorial or explanations.\n\n`;

export const defaultScript = `const App = () => (
  <div>
   Hello World
  </div>
);`;

export const placeholder = `What would you like to generate?

Examples:
- A todo app that looks like vaporwave
- A tic tac toe game
- A CSS Box shadow preview app`;

export const questionPlaceholder = `Ask a question about the sketch

Examples:
- Why isn't the ball following my cursor
- What does line 32 mean?
- Explain the attractParticle() function`;
