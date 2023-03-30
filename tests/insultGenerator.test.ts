import { insultGenerator } from "../src/classes/insultGenerator/insultGenerator";

test("Insult Generator API Access Success Test", async () => {
    expect(await (await new insultGenerator().getInsult()).isFailure).toBeFalsy();
});
