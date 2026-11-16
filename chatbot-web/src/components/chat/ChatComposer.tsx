import { ArrowUpOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import type { KeyboardEvent } from 'react';

interface ChatComposerProps {
    value: string;
    maxLength: number;
    canSend: boolean;
    sending: boolean;
    onChange: (value: string) => void;
    onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
    onSend: () => void;
}

export function ChatComposer({ value, maxLength, canSend, sending, onChange, onKeyDown, onSend }: ChatComposerProps) {
    return (
        <div className="chat-composer">
            <div className="chat-composer__box">
                <Input.TextArea
                    className="chat-composer__input"
                    variant="borderless"
                    placeholder="Preguntá sobre una banda, un disco o un músico..."
                    autoSize={{ minRows: 1, maxRows: 6 }}
                    maxLength={maxLength}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    onKeyDown={onKeyDown}
                    autoFocus
                />
                <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    icon={<ArrowUpOutlined />}
                    onClick={onSend}
                    disabled={!canSend}
                    loading={sending}
                    aria-label="Enviar"
                />
            </div>
            <div className="chat-composer__hint">Enter para enviar · Shift + Enter para un salto de línea</div>
        </div>
    );
}
