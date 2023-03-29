import { Result } from "./Result";
import fs from 'fs';
import path from "path";

export function logMethod(target:any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
        const result = originalMethod.apply(this, args);
        if (result.isFailure) {
            try {
                const log = `\n${propertyName}, called with arguments: ${JSON.stringify(args)}.\n Returned Error: ${JSON.stringify(result.error)}`;
                const filePath = path.join(process.cwd(), 'src/logs', `${propertyName}.txt`);
                fs.appendFileSync(filePath, log);
            } catch (err) {
                console.error(err);
            }
        }
        return result;
    };
}