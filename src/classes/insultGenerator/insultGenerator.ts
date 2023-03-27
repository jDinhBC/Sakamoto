import { logMethod } from "../other/commandLogger";
import { Result } from "../other/Result";

export class insultGenerator {

    @logMethod
    async getInsult() {
        try {
            const request = await fetch('https://evilinsult.com/generate_insult.php?lang=en&type=json');
            if (!request.ok) {
                return Result.fail("evilInsult.com is not reponding from their API...");
            }
            const data = await request.json();
            return Result.success(data.insult);
        } catch (error) {
            return Result.fail("Something went wrong with the insult API...");
        }
    }
}
