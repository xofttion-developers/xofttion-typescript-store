import { Store } from './src/store';

interface Person {
  name?: string;
  age?: number;
}

class StorePerson extends Store<Person> {
  constructor() {
    super({});
  }

  changeName(name: string): void {
    this.reduce((state) => ({ ...state, name }));
  }

  changeAge(age: number): void {
    this.reduce((state) => ({ ...state, age }));
  }
}

const store = new StorePerson();

const currentState = store.getCurrent();
console.log(currentState);

store.changeName('Daniel Castillo');
store.changeAge(31);

const currentState2 = store.getCurrent();
console.log(currentState2);
console.log(currentState);
