import { Spin } from 'antd';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import type { ChatMessage } from '../../models/chat';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface MessageListProps {
    messages: ChatMessage[];
    sending: boolean;
    loading: boolean;
}

export function MessageList({ messages, sending, loading }: MessageListProps) {
    const scrollRef = useAutoScroll<HTMLDivElement>(`${messages.length}-${sending}`);

    return (
        <div className="message-list" ref={scrollRef}>
            <div className="message-list__inner">
                {loading && <Spin style={{ margin: '40px auto' }} />}
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}
                {sending && <TypingIndicator />}
            </div>
        </div>
    );
}
