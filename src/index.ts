type KeyValue = "startLoop" | "endLoop";
class Typewriter {
  tag: HTMLElement;
  initial: string[];
  current_text: string[];
  speed: number = 200;
  instantaneous_text: string[];
  cursor: string = "|";
  constructor(elem: HTMLElement, speedInMs: number = 200, cursor?: string) {
    this.tag = elem;
    this.speed = speedInMs;
    this.initial = this.tag.innerHTML.split("");
    this.current_text = [];
    this.instantaneous_text = [];
    if(cursor) {
      this.cursor = cursor;
    }
  }

  private callstack = {
    memorizing: false,
    looping: false,
    stack: Array<() => any>(),
    memory: {
      stack: Array<() => any>(),
      get() {
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
        const func = () => (this.looping = true);
        this.stack.push(func);
        this.run(this.stack.indexOf(func));
        return;
      }
      if (obj === "endLoop") {
        const func = () => this.end_loop;
        this.stack.push(func);
        this.run(this.stack.indexOf(func));
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
        }
        this.run(0);
      }
    },
    end_loop() {
      this.stack = this.memory.get();
      this.run(0);
    },
  };

  private getRandomTime(): number {
    return Math.floor(Math.random() * (1.5 * this.speed) + 0.25 * this.speed);
  }

  private sync() {
    // Syncs the current text with the DOM
    let raw = "";
    this.current_text.forEach((char) => {
      if (char.length <= 1) {
        raw += `<span class="letter">${char}</span>`;
      } else {
        raw += char;
      }
    });
    raw += `<span class="caret">${this.cursor}</span>`;
    this.tag.innerHTML = raw;
  }

  private __setSpeed(speed: number) {
    this.speed = speed;
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

  private __put(str: string, state: "html" | "text") {
    if(state === "text") {
      const chars = str.split("");
      chars.forEach((char) => {
        this.current_text.push(char);
      });
    } else {
      this.current_text.push(str);
    }
    this.sync();
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
    this.initial.forEach((char) => {
      this.current_text.push(char);
    });
    this.sync();
    return this;
  }

  write(str: string) {
    str.split("").forEach((char) => {
      this.instantaneous_text.push(char);
    });
    this.callstack.queue(() => this.__write(str));
    return this;
  }

  delete(input: number | true) {
    let n = 0;
    if (input === true) {
      n = this.instantaneous_text.length;
    } else {
      n = input;
    }
    for (let i = 0; i < n; i++) {
      this.instantaneous_text.pop();
    }
    this.callstack.queue(() => this.__delete(n));
    return this;
  }

  put(str: string, state: "html" | "text") {
    if(!state) throw new Error("Please state put mode, 'text' or 'html'")
    if (state === "text") {
      str.split("").forEach((char) => {
        this.instantaneous_text.push(char);
      });
    } else {
      this.instantaneous_text.push(str);
    }
    this.callstack.queue(() => this.__put(str, state));
    return this;
  }

  setSpeed(speed: number) {
    this.callstack.queue(() => this.__setSpeed(speed));
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
