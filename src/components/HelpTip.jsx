export default function HelpTip({ visible }) {
    if (!visible) return null;

    return (
        <div id="help-tip">
            <p>
                <kbd>Click</kbd> chọn nội thất · <kbd>G</kbd> Move · <kbd>R</kbd> Rotate · <kbd>C</kbd> Scale · <kbd>Chuột phải</kbd> Góc nhìn · <kbd>WASD/Space/Shift</kbd> Bay · <kbd>👁 Góc nhìn 1</kbd> Đi dạo trong nhà
            </p>
        </div>
    );
}
