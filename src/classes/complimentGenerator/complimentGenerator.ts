import { logMethod } from "../other/commandLogger";
import { Result } from "../other/Result";
import path from "path";
import fs from 'fs';

export class complimentGenerator {
    static readonly compPath = path.join(process.cwd(), 'src/classes/complimentGenerator/compliments.txt');

    @logMethod
    async getCompliment() {
        //read file
        const compFile = fs.readFileSync(complimentGenerator.compPath, 'utf-8');

        if (!compFile) {
            return Result.fail(`Compliments file was not found at: ${complimentGenerator.compPath}`);
        }

        const compliments = compFile.split(",\r\n");
        const result = compliments[Math.round(Math.random()*compliments.length)];
        return Result.success(result.substring(1,result.length-1));
    }
}
