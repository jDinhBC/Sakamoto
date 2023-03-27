import { Result } from "./Result";
import fs from 'fs';

export function logMethod(target:any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
        const result: Result<any> = originalMethod.apply(this, args);
        if (result.isFailure) {
            const log = `${propertyName}, called with arguments: ${JSON.stringify(args)}.\n Returned Error: ${JSON.stringify(result.error)}.\n`;
            fs.appendFileSync(`../../data/${propertyName}.txt`,log);
        }
        return result;
    };
    return descriptor;
}