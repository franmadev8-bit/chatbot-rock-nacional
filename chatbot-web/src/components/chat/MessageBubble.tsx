import type { ChatMessage } from '../../models/chat';
import { FormattedText } from './FormattedText';
import { MessageSources } from './MessageSources';

export function MessageBubble({ message }: { message: ChatMessage }) {
    const isUser = message.role === 'user';

    return (
        <div className={`message-row ${isUser ? 'message-row--user' : ''}`}>
            <div className={`message-bubble ${isUser ? 'message-bubble--user' : 'message-bubble--assistant'}`}>
                {!isUser && <span className="message-bubble__author">Rock Nacional IA</span>}
                <FormattedText text={message.content} />
                {!isUser && message.sources && <MessageSources sources={message.sources} />}
            </div>
        </div>
    );
}
