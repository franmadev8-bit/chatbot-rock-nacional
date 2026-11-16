export function TypingIndicator() {
    return (
        <div className="message-row">
            <div className="message-bubble message-bubble--assistant">
                <span className="message-bubble__author">Rock Nacional IA</span>
                <span className="typing" aria-label="Escribiendo">
                    <span />
                    <span />
                    <span />
                </span>
            </div>
        </div>
    );
}
