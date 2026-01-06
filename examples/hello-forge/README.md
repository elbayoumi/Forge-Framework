# Hello Forge Example

A minimal example demonstrating Forge usage.

## Project Structure

```
hello-forge/
├── src/
│   └── ui.js          # UI declaration
└── README.md
```

## UI Code

```javascript
ui(column(text("Hello Forge"), button("Click Me", handleClick)));
```

## Build Commands

### 1. Generate Semantic Bundle

```bash
forge build web
```

**Output:** `.forge/semantic/semantic.json`

This generates the semantic representation of your UI.

### 2. Generate Android Project

```bash
forge build android
```

**Output:** `.forge/native/android/`

This generates a complete Android Gradle project with Jetpack Compose.

## Inspect Commands

### View UI Tree

```bash
forge inspect ui
```

**Output:**

```
UI Tree:

column
  text {"content":"Hello Forge"}
  button {"label":"Click Me","action":"handleClick"}
```

### View Semantic Bundle

```bash
forge inspect semantic
```

**Output:** Full semantic bundle as JSON.

## Generated Android Code

The generated `MainActivity.kt` will contain:

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

## Build Android APK

```bash
cd .forge/native/android
./gradlew assembleDebug
```

The APK will be generated at:

```
.forge/native/android/app/build/outputs/apk/debug/app-debug.apk
```

## Notes

- The semantic bundle (`.forge/semantic/semantic.json`) is the single source of truth
- The Android project is generated from the semantic bundle, not directly from `ui.js`
- All generated code is inspectable and can be modified if needed
- Button clicks log to Logcat with tag "ForgeApp"
