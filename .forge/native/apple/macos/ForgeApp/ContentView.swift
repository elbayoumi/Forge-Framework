import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack(spacing: 0) {
            // Generated Content
            VStack {
    Text("Hello macOS")
    Button(action: { print("Action: testAction") }) {
    Text("Click Me")
}
}
        }
        .frame(minWidth: 400, minHeight: 300)
        .padding()
        .background(Theme.backgroundColor)
    }
}

#Preview {
    ContentView()
}
