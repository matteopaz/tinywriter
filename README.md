# Tinywriter
Hello, this is a minimal and simple library for creating a typing effect on a text element. It is built with Typescript, and *tiny* at around *<3KB* minified. Perfect for using on a small scale. It is capable of synchronous waiting, writing, deleting, and infinitely looping.


# Usage
Here is the most basic usage case;
```
import Typewriter from 'tinywriter';

const tag = document.getElementById("text"); // Grab HTML element
const time = 200; // Median time in ms to type/delete one character

const writer = new Typewriter(tag, time);

writer.init() // Begin with init() always
  .write("Hello World"); // Methods are chainable
```
As you can see, most of the code comes intuitively.
Lets create a more complex sequence. Assuming `writer` is defined as it is above:

```
writer.init()
  .write("I'll see you in 5 seconds!")
  .wait(5000) // wait in ms
  .write("  ")
  .write("Hello!")
  .end() // end() is not chainable, and it removes the caret from the DOM
```

# Complete Documentation

## Initialization
### Constructor
```
import Typewriter from 'tinywriter';
new Typewriter(tag: HTMLElement, speed: number = 200)
```
### `Typewriter.init`
Initializes the object and readies the targeted HTML element via inline-splitting. Takes no arguments and returns this.
```
writer.init(): this
```
## Typing Methods

### `Typewriter.write`
Writes the inputted string, slightly varies from the given speed per character randomly to give an authentic effect.
```
writer.write(str: string): this
```

### `Typewriter.delete`
Deletes the given amount of characters, also slightly varies from the given speed per character the same random variance as .write.
```
writer.delete(characters: number): this
```
## Flow Control
### `Typewriter.wait`
Waits for the given time in milliseconds, before continuing to the next chained task, if any;
```
writer.wait(timeInMs: number): this
```
### `Typewriter.defineLoopStart` & `Typewriter.defineLoopEnd()`
When calling this `Typewriter.defineLoopStart`, you must match it with a `Typewriter.defineLoopEnd()` after some operations. You will not be able to call any more methods after starting a loop, as the loop runs infinitely. To create a finite loop, you may create your own loop and start another `writer` chain. You may also chain events before starting an infinite loop. `Typewriter.defineLoopEnd` is not chainable to avoid confusion.
```
writer.defineLoopStart()
.write("Hello!")
.wait(500)
.delete(6)
.wait(500)
.defineLoopEnd()
```

# Developing
## Build Tools
This project uses `tsc` for type declarations and ESBuild for bundling and minification. The ESBuild config is defined in the `build.js` script.

## Live Dev
The root directory `index.html` can be run for testing purposes. It includes boilerplate for the library to function.

