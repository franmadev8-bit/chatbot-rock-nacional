import { MAX_QUESTION_LENGTH, useChatViewModel } from '../../hooks/useChatViewModel';
import { ChatComposer } from './ChatComposer';
import { EmptyChat } from './EmptyChat';
import { MessageList } from './MessageList';

export function ChatPanel() {
    const vm = useChatViewModel();

    return (
        <div className="chat-panel">
            {vm.isEmpty ? (
                <EmptyChat suggestions={vm.suggestions} disabled={vm.sending} onPick={(q) => void vm.send(q)} />
            ) : (
                <MessageList messages={vm.messages} sending={vm.sending} loading={vm.loadingMessages} />
            )}

            <ChatComposer
                value={vm.draft}
                maxLength={MAX_QUESTION_LENGTH}
                canSend={vm.canSend}
                sending={vm.sending}
                onChange={vm.setDraft}
                onKeyDown={vm.handleKeyDown}
                onSend={() => void vm.send()}
            />
        </div>
    );
}
