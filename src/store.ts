import { deepFreeze } from '@xofttion/utils';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';

type StateObject = { [key: string]: any };

class State<T extends StateObject> {
  private subject: BehaviorSubject<T>;

  constructor(private initialValue: T) {
    this.subject = new BehaviorSubject(deepFreeze(this.initialValue));
  }

  public getCurrent(): T {
    return this.subject.value;
  }

  public reset(): void {
    this.reduce(() => this.initialValue);
  }

  public reduce(reducer: (_: T) => T): void {
    this.subject.next(deepFreeze(reducer(this.subject.value)));
  }

  public select<V>(selector: (_: T) => V): V {
    return selector({ ...this.subject.value });
  }

  public observe(): Observable<T> {
    return this.subject.asObservable();
  }

  public subscribe(subscriber: (_: T) => void): Subscription {
    return this.observe().subscribe(subscriber);
  }
}

export class Store<T extends StateObject> {
  private state: State<T>;

  constructor(value: T) {
    this.state = new State(value);
  }

  public getCurrent(): T {
    return this.state.getCurrent();
  }

  public reset(): void {
    this.state.reset();
  }

  protected reduce(reducer: (_: T) => T): void {
    this.state.reduce(reducer);
  }

  protected select<V>(selector: (_: T) => V): V {
    return this.state.select(selector);
  }

  protected observe<V>(observer: (_: T) => V): Observable<V> {
    return this.state.observe().pipe(map((state) => observer(state)));
  }

  public subscribe(subscriber: (_: T) => void): Subscription {
    return this.state.subscribe(subscriber);
  }
}
