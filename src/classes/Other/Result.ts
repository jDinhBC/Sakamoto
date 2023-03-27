export class Result<T> {
    public success: boolean;
    public isFailure: boolean;
    private _error: string;
    public readonly value: T;

    public get error(): string {
        return this._error;
    }

    protected constructor(success: boolean, error: string, value: T) {
        if (success && error) {
            throw new Error(`Returned success and error: ${error}`);
        }
        if (!success && !error) {
            throw new Error('Returned failure and no error');
        }
        this.success = success;
        this.isFailure = !success;
        this._error = error;
        this.value = value;
    }

    public static fail<T>(error: string): Result<T> {
        return new Result(false, error, null as any);
    }

    public static success<T>(value?: T): Result<T> {
        return new Result(true,'', value as T);
    }
}