# Tinywriter
Hello, this is a powerful but simple library for creating a typing effect on a text element. It is built with Typescript, and *tiny* at  *<4KB* minified. Perfect for using on a small scale. It is capable of synchronous waiting, writing, deleting, and infinitely looping. It has elegant syntax, with method chaining and action queueing, and is able to put and delete HTML.
### [Demo](https://jsfiddle.net/dmv2oyas/) - JSFiddle
### [NPM](https://www.npmjs.com/package/tinywriter)


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
  .put("<br />", "html")
  .write("Hello!")
  .wait(1000)
  .delete(true)
  .end() // .end() is not chainable, and it removes the caret from the DOM
```
### Styling
The individual letters in the given tag are represented by span tags with the `.letter` class. The caret is also a span tag with the `.caret` class. These can be hooked onto and used for styling. When using `put()` in html mode, keep in mind you can also insert elements with classes and attributes for styling.

### A warning
With the ability to put HTML to the DOM unsanitized, take great care in how you use this library. It is not recommended to allow the users to interact with the Typewriter class and its instances. This package was made for special effects usage in mind.

# Complete Documentation

## Initialization
### Constructor
Instantiates the imported class. Please pass in a valid tag and speed, you may also pass in a special character(s) for the cursor. The speedInMs is the median speed of any 'typing' operation. There will be some variance in the operation speed for realism and the typewriter effect.
```
import Typewriter from 'tinywriter';
new Typewriter(tag: HTMLElement, speedInMs: number, cursor?: string)
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
Deletes the given amount of characters or all if `true` is passed in, also slightly varies from the given speed per character the same random variance as .write. If you need to delete all characters, use `writer.delete(true)`, rather than a large number.
```
writer.delete(characters: number | true): this
```

### `Typewriter.put`
Instantly puts the given string into the DOM. There are two modes, and you are required to specify which one, 'html' and 'text'. HTML mode will attempt to insert the given string as a chunk, raw inside your selected HTML tag. Text mode will do the same thing as `write` but instantaneously.
```
writer.put(`<span class="alert">Warning!</span>`, 'html');
writer.put("Suprise!", 'text');
```
## Flow Control

### `Typewriter.setSpeed`
Sets the median operation speed from method call onward. Works the same way as the initial speed passed into the constructor.
```
writer.setSpeed(timeInMs: number): this
```
### `Typewriter.wait`
Waits for the given time in milliseconds, before continuing to the next chained task, if any;
```
writer.wait(timeInMs: number): this
```
### `Typewriter.defineLoopStart` & `Typewriter.defineLoopEnd`
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

