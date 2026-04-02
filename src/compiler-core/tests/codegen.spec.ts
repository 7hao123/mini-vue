import { transform } from "../src/transform";
import { generate } from "../src/codegen";
import { baseParse } from "../src/parse";

describe("codegen", () => {
  it("string", () => {
    const ast = baseParse("hi 1");
    transform(ast);

    const { code } = generate(ast);

    expect(code).toMatchSnapshot();
  });
});
