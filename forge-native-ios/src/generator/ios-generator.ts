
export interface SemanticNode {
    type: string;
    content?: string;
    label?: string;
    action?: string;
    children?: SemanticNode[];
}

export class iOSGenerator {
    generate(node: SemanticNode): string {
        switch (node.type) {
            case 'text':
                return `Text("${node.content || ''}")`;
            case 'button':
                const label = node.label || 'Button';
                const action = node.action || '';
                // Simple action logging
                return `Button(action: { print("Action: ${action}") }) { Text("${label}") }`;
            case 'column':
                return `VStack {\n${this.generateChildren(node)}\n}`;
            case 'row':
                return `HStack {\n${this.generateChildren(node)}\n}`;
            case 'ui':
                // Pass through children, wrapping in VStack if multiple, but usually ui() takes one root.
                if (node.children?.length === 1) {
                    return this.generate(node.children[0]);
                }
                return `VStack {\n${this.generateChildren(node)}\n}`;
            default:
                return `Text("Unknown: ${node.type}")`;
        }
    }

    private generateChildren(node: SemanticNode): string {
        if (!node.children || node.children.length === 0) return "";
        return node.children.map(c => this.generate(c)).join("\n");
    }
}
