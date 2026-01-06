# Forge FAQ

## Technical Architecture

### Is Forge a framework?

**No.** Forge is a compiler.

Frameworks (React, Vue, Flutter) ship a runtime engine to the device. Forge ships nothing. It reads your source code at build time, compiles it to native code (Kotlin/Swift), and discards the JavaScript.

### Is this a React Native alternative?

**No.** React Native is for building apps today. Forge is for researching compilers of tomorrow.

- **React Native:** Bridges JS to Native at runtime. Great for sharing code.
- **Forge:** Compiles intentions to Native at build time. Zero runtime overhead, but severe static analysis constraints.

### Why no JSX?

JSX implies a Virtual DOM runtime. Forge has no runtime.
We use standard JavaScript function calls (`ui()`, `column()`) because they are easier to statically analyze without a complex transpiler chain.

### Why no arrays in the DSL?

Arrays (`[1, 2, 3]`) are runtime data structures.
Forge does not execute your code. It reads it. To support arrays, we would need to implement a static list unrolling mechanism in the compiler. We haven't built that yet.

## Roadmap & Features

### Why Android first?

Android's UI framework (Jetpack Compose) uses a declarative Kotlin syntax that maps very cleanly to our semantic model. It was the fastest path to proving the compiler architecture works.

### When iOS?

When we write the SwiftUI backend generator.
The semantic model is platform-agnostic, but we need to write the specific code generator that outputs Swift code. Expected in late v0.2 or v0.3.

### Why no state management?

Because state requires a **Semantic Data Model**.
To allow `count + 1` without a runtime, the compiler needs to understand what "count" is and how it changes. We are currently designing this semantic model. Until then, v0.1 is stateless.
