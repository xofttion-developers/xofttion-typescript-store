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

  public reduce(reducer: (value: T) => T): boolean {
    try {
      this.subject.next(deepFreeze(reducer(this.subject.value)));

      return true;
    } catch {
      return false;
    }
  }

  public select<V>(selector: (value: T) => V): V {
    return selector({ ...this.subject.value });
  }

  public observe(): Observable<T> {
    return this.subject.asObservable();
  }

  public subscribe(subscriber: (value: T) => void): Subscription {
    return this.observe().subscribe(subscriber);
  }
}

export interface AbstractStore<T extends StateObject> {
  getCurrent(): T;

  reset(): void;

  subscribe(subscriber: (value: T) => void): Subscription;
}

export class Store<T extends StateObject> implements AbstractStore<T> {
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

  public subscribe(subscriber: (value: T) => void): Subscription {
    return this.state.subscribe(subscriber);
  }

  protected reduce(reducer: (value: T) => T): boolean {
    return this.state.reduce(reducer);
  }

  protected select<V>(selector: (value: T) => V): V {
    return this.state.select(selector);
  }

  protected observe<V>(observer: (value: T) => V): Observable<V> {
    return this.state.observe().pipe(map((state) => observer(state)));
  }
}
