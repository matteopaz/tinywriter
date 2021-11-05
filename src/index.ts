type KeyValue = "startLoop" | "endLoop";
class Typewriter {
  tag: HTMLElement;
  text: string[];
  current_text: string[];
  speed: number = 200;
  constructor(elem: HTMLElement, speedInMs: number = 200) {
    this.tag = elem;
    this.speed = speedInMs;
    this.text = this.tag.innerHTML.split("");
    this.current_text = [];
  }

  private callstack = {
    memorizing: false,
    looping: false,
    stack: Array<() => any>(),
    memory: {
      stack: Array<() => any>(),
      get() {
        console.log({ stack: this.stack });
        return [...this.stack];
      },
      push(func: () => Promise<any> | void) {
        this.stack.push(func);
      },
    },
    get() {
      return this.stack[0];
    },
    queue(obj: (() => Promise<any> | void) | KeyValue) {
      if (obj === "startLoop") {
        this.memorizing = true;
        this.stack.push(() => (this.looping = true));
        this.run(this.stack.indexOf(() => (this.looping = true)));
        return;
      }
      if (obj === "endLoop") {
        this.stack.push(this.end_loop);
        this.run(this.stack.indexOf(this.end_loop));
        return;
      }
      if (!this.memorizing) {
        this.stack.push(obj as () => Promise<any> | void);
        this.run(this.stack.indexOf(obj as () => Promise<any> | void));
      } else {
        this.memory.push(obj as () => Promise<any> | void);
      }
    },
    async run(index: number) {
      const now = this.get();
      if (now && index === 0) {
        await now.bind(this)();
        this.stack.shift();
        if (this.looping && this.stack.length === 0) {
          this.stack = this.memory.get();
          console.log(this.stack);
        }
        this.run(0);
      }
    },
    end_loop() {
      console.log("end loop");
      this.stack = this.memory.get();
      this.run(0);
    },
  };

  private getRandomTime(): number {
    return Math.floor(Math.random() * (1.5 * this.speed) + 0.25 * this.speed);
  }

  private sync() {
    let raw = "";
    this.current_text.forEach((char) => {
      raw += `<span class="letter">${char}</span>`;
    });
    raw += `<span class="caret">|</span>`;
    this.tag.innerHTML = raw;
  }

  private __wait(time: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, time);
    });
  }

  private __write(str: string) {
    const chars = str.split("");
    let prevTimeout = 0;
    chars.forEach((char) => {
      const time = prevTimeout + this.getRandomTime();
      prevTimeout = time;
      setTimeout(() => {
        this.current_text.push(char);
        this.sync();
      }, time);
    });
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this);
      }, prevTimeout + 10);
    });
  }

  private __delete(num: number) {
    let prevTimeout = 0;
    for (let i = 0; i < num; i++) {
      const time = prevTimeout + this.getRandomTime();
      prevTimeout = time;
      setTimeout(() => {
        this.current_text.pop();
        this.sync();
      }, time);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this);
      }, prevTimeout + 10);
    });
  }

  private __end() {
    let raw = "";
    this.current_text.forEach((char) => {
      raw += `<span class="letter">${char}</span>`;
    });
    this.tag.innerHTML = raw;
  }

  init() {
    this.text.forEach((char) => {
      this.current_text.push(char);
    });
    this.sync();
    return this;
  }

  write(str: string) {
    this.callstack.queue(() => this.__write(str));
    return this;
  }

  delete(num: number) {
    this.callstack.queue(() => this.__delete(num));
    return this;
  }

  wait(time: number) {
    this.callstack.queue(() => this.__wait(time));
    return this;
  }

  defineLoopStart() {
    this.callstack.queue("startLoop");
    return this;
  }

  defineLoopEnd() {
    this.callstack.queue("endLoop");
    return null;
  }

  end() {
    this.callstack.queue(() => this.__end());
    return null;
  }
}
export default Typewriter;