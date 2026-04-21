import { runPython } from "./src/lib/runner.js";

async function test() {
  console.log("=== TEST 1: stdout check ===");
  const res1 = await runPython("print('hello from piston')");
  console.log(res1);

  console.log("\n=== TEST 2: stderr check ===");
  const res2 = await runPython("1 / 0");
  console.log(res2);
}

test();
