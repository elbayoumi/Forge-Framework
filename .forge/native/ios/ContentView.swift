import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
Text("Hello iOS")
Button(action: { print("Action: testAction") }) { Text("Press Me") }
}
    }
}
