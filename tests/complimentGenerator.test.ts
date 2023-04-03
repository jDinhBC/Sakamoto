import { complimentGenerator } from "../src/classes/complimentGenerator/complimentGenerator";
import path from 'path';
import fs from 'fs';

const complimentsDataPath = path.join(process.cwd(), 'src/classes/complimentGenerator/compliments.txt');
const dataFile = fs.readFileSync(complimentsDataPath, 'utf8');

test("Compliments Data File Exists Test", async () => {
    expect(complimentGenerator.compPath).toEqual(complimentsDataPath);
});

test("Compliments Data File Read Test", async () => {
    expect(await dataFile).toContain((await new complimentGenerator().getCompliment()).value);
})
