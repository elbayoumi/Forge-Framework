# Forge

A semantic compiler that transforms JavaScript UI declarations into native application code at build time. **Zero Runtime. Pure Native Output.**

## What is Forge?

Forge is a **compiler**, not a framework or runtime.

It parses JavaScript UI declarations, extracts semantic intent, and generates native code. The JavaScript you write is **never executed**—it is analyzed at build time to understand what UI you want, then discarded. The output is pure native code.

**Critical distinction:** Forge does not run JavaScript. It reads JavaScript as a declarative DSL (domain-specific language) to understand UI structure, then generates equivalent native code. The generated application contains zero JavaScript.

### Compilation Pipeline

```
JavaScript UI → AST Parser → Semantic Analyzer → Semantic Bundle → Native Code Generator → Native Project
```

1. **Parse:** JavaScript UI declarations are parsed into an abstract syntax tree
2. **Analyze:** Semantic meaning is extracted (what components represent, not how they execute)
3. **Bundle:** A semantic bundle (intermediate representation) is generated
4. **Generate:** Native code is produced from the semantic bundle

The output is indistinguishable from hand-written native applications.

## What Forge is NOT

> [!WARNING] > **Forge is NOT a JavaScript Framework.**

If you approach Forge expecting React, text replacement, or a runtime engine, you will be disappointed.

### ❌ NOT a Runtime

- **No JavaScript Engine:** Your app does not ship with V8, Hermes, or JavaScriptCore.
- **No Bridge:** There is no communication layer between JS and Native.
- **No Interpreters:** The device executes 0% JavaScript.

### ❌ NOT a Hybrid Framework

- **Not React Native:** No Metro bundler, no JSI.
- **Not Flutter:** No Skia rendering engine, no Dart.
- **Not Capacitor/Ionic:** No WebView, no HTML/CSS rendering.

### ❌ NOT a Bundler

- **Does not bundle JS:** The "build" process destroys the JS source after reading it.
- **No Webpack/Vite:** We do not produce `.js` bundles.

## What Forge IS

**Forge is a Compiler.** It reads your source code once (at build time) on your development machine, extracts the _intent_ (e.g. "I want a button here"), and compiles it into a pure, platform-native application (e.g. Kotlin/Jetpack Compose for Android).

## Why Forge Exists

**Problem:** Runtime JavaScript engines add megabytes to app size, consume memory, and introduce performance overhead. WebViews render HTML/CSS instead of native UI. Cross-platform bridges create synchronization complexity and debugging difficulties.

**Solution:** Compile-time semantic analysis. Forge analyzes UI intent at build time and generates native code. No JavaScript runtime, no WebView, no bridge. The generated application is pure native code using platform-standard UI frameworks (Jetpack Compose for Android).

## The Mental Model (Crucial)

To use Forge, you must accept this constraint: **The JavaScript file is a configuration file, not a program.**

It looks like JavaScript to leverage your editor's syntax highlighting and autocomplete, but it is treated as a static DSL.

### 🛑 Strict DSL Constraints

The following features of JavaScript are **COMPLETELY IGNORED OR FORBIDDEN**:

1.  **No Variables:** You cannot define `const x = 10` and pass `x` to a component.
2.  **No Logic:** `if`, `for`, `while`, `map`, `filter` are not executed.
3.  **No JSX:** Forge does not use `<Component />` syntax.
4.  **No External Libraries:** You cannot `import` utility libraries from npm.

### Allowed Syntax

You strictly declare a tree of UI nodes:

```javascript
// ✅ CORRECT
ui(column(text("Hello World"), button("Press Me", handlePress)));
```

### Forbidden Syntax

```javascript
// ❌ WRONG - The compiler will fail or ignore these
const name = "User"; // Variable definition
const items = [1, 2]; // Arrays

ui(
  column(
    text(name), // Variable usage
    items.map((i) => text(i)) // Runtime logic
  )
);
```

> [!IMPORTANT] > **Why?** Since there is no JavaScript runtime on the device, we cannot "run" a loop. We must be able to statically look at your code and know exactly what UI to generate 100% of the time without executing it.

## Current Scope: v0.1 (Architecture Preview)

> [!CAUTION] > **v0.1 is for compiler architecture demonstration only.**
> Do not attempt to build real applications with this version.

**Limitations:**

- **Platforms:** Android Only (iOS/Web/Desktop coming later)
- **Features:** Static content and basic button clicks only.
- **Missing:** State, Navigation, Inputs, API calls, Styling, Layout options.

**What you CAN build:**

- A native "Hello World" app that proves the compiler pipeline works.

**What you CANNOT build:**

- Anything else.

## Quick Start (5 Minutes)

**1. Create project structure:**

```
my-app/
└── src/
    └── ui.js
```

**2. Write UI declaration in `src/ui.js`:**

```javascript
ui(column(text("Hello Forge"), button("Click Me", handleClick)));
```

**3. Generate semantic bundle:**

```bash
forge build web
```

Output: `.forge/semantic/semantic.json`

**4. Generate Android project:**

```bash
forge build android
```

Output: `.forge/native/android/` (complete Gradle project)

**5. Build Android APK:**

```bash
cd .forge/native/android
./gradlew assembleDebug
```

The generated `MainActivity.kt` contains:

```kotlin
@Composable
fun MainScreen() {
    Column {
        Text(text = "Hello Forge")
        Button(onClick = { Log.d("ForgeApp", "Button clicked: handleClick") }) {
            Text(text = "Click Me")
        }
    }
}
```

## CLI Commands

**forge build**

Runs web build, then android build (if web succeeds).

**forge build web**

Parses `src/ui.js` and generates semantic bundle at `.forge/semantic/semantic.json`.

**forge build android**

Reads semantic bundle and generates Android Gradle project at `.forge/native/android/`.

Requires semantic bundle to exist (run `forge build web` first).

**forge inspect ui**

Displays UI component tree from semantic bundle.

Example output:

```
[forge] UI tree:

ui
  column
    text {"content":"Hello Forge"}
    button {"label":"Click Me","action":"handleClick"}
```

**forge inspect semantic**

Displays complete semantic bundle as formatted JSON.

**forge help**

Shows usage information and examples.

## Inspector

The inspector provides read-only access to semantic artifacts.

**Purpose:**

- **Trust:** Verify what Forge generates. No hidden transformations.
- **Debugging:** Determine if issues are in parsing (web builder) or code generation (native compiler).

Inspector commands never modify files. They are pure read operations.

## How Forge Works

**Deterministic builds:**

Identical input produces identical output. No timestamps, random values, or system-dependent data appear in generated code. Builds are reproducible across machines and time.

**Inspectable artifacts:**

Every stage produces explicit artifacts:

- `.forge/semantic/semantic.json` - Semantic bundle (human-readable JSON)
- `.forge/native/android/` - Generated Android project (standard Gradle)

All artifacts can be inspected, modified, and re-compiled. There are no hidden transformations.

**No runtime dependencies:**

Generated applications use only platform-standard SDKs. No Forge-specific libraries are required at runtime.

## Roadmap

**v0.2 (Next):**

- Conditional rendering (semantic primitives, not runtime JS)
- List rendering (semantic primitives, not runtime JS)
- Basic state management
- Navigation between screens

**Future:**

- iOS compiler (SwiftUI code generation)
- Web compiler (framework-agnostic output)
- Desktop compilers (Qt, native)
- Expanded semantic model (actions, effects)
- Enhanced inspector (validation, visualization)

## Technical Details

**Dependencies:**

- Babel (AST parsing)
- TypeScript (compiler implementation)
- No runtime dependencies in generated code

**Generated code:**

- Standard Gradle projects (Android)
- No custom build plugins or tooling required
- Uses platform-standard UI frameworks
- No Forge-specific runtime libraries

**Semantic bundle format:**

JSON representation of UI structure, state model, action model, and design tokens. Documented in `forge-core` type definitions.

## Contributing

Forge is architecture-first. Contributions must maintain:

1. Deterministic builds (no random or time-dependent output)
2. Compile-time guarantees (no runtime execution)
3. Inspectable artifacts (no hidden transformations)
4. Test coverage for all code paths

## Frequently Asked Questions

**Q: Why not just use React Native?**

A: React Native runs JavaScript at runtime and uses a bridge to communicate with native code. Forge generates native code at build time. No JavaScript runtime, no bridge, no synchronization overhead.

**Q: Why not just use Flutter?**

A: Flutter uses a custom rendering engine and Dart runtime. Forge generates platform-standard native code (Jetpack Compose, SwiftUI). No custom runtime, no framework-specific rendering.

**Q: Can I use npm packages?**

A: No. Forge does not execute JavaScript. npm packages are runtime libraries. Forge only reads JavaScript as a declarative DSL.

**Q: Can I write normal JavaScript functions?**

A: No. Forge performs static semantic analysis. It does not execute code. The JavaScript you write is a restricted DSL, not executable code.

**Q: When will this be production-ready?**

A: Not soon. v0.1 is a compiler architecture demonstration. Production readiness requires expanded semantic models, more platforms, comprehensive component libraries, and extensive testing.

**Q: Why use JavaScript if it's not executed?**

A: Familiarity. Developers know JavaScript syntax. Using JavaScript as a compile-time DSL lowers the learning curve compared to inventing a new syntax.

**Q: Is this better than native development?**

A: No. v0.1 is far worse than native development. The value proposition is compile-time semantic analysis enabling future cross-platform code generation without runtime overhead. This is a long-term architectural bet, not a current productivity win.

## License

MIT
