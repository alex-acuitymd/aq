import generate from "./generate.mjs";
import read from "./read.mjs";
import write from "./write.mjs";

(function () {
  write(generate(read()));
})();
