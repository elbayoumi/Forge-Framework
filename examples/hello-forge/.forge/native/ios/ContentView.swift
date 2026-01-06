import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
Text("Integration Test")
Button(action: { print("Action: test") }) { Text("Build iOS") }
}
    }
}
