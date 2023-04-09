import { Observable, Subscription } from 'rxjs';
type StateObject = {
    [key: string]: any;
};
export declare class Store<T extends StateObject> {
    private state;
    constructor(value: T);
    getCurrent(): T;
    reset(): void;
    protected reduce(reducer: (_: T) => T): void;
    protected select<V>(selector: (_: T) => V): V;
    protected observe<V>(observer: (_: T) => V): Observable<V>;
    subscribe(subscriber: (_: T) => void): Subscription;
}
export {};
