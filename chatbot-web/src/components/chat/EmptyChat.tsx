import { Button, Typography } from 'antd';

interface EmptyChatProps {
    suggestions: string[];
    disabled: boolean;
    onPick: (question: string) => void;
}

export function EmptyChat({ suggestions, disabled, onPick }: EmptyChatProps) {
    return (
        <div className="message-list">
            <div className="empty-chat">
                <span className="empty-chat__kicker">Preguntá lo que quieras</span>
                <Typography.Title className="empty-chat__title">
                    Bandas, discos,<br />
                    <em>historias</em> y rupturas.
                </Typography.Title>
                <Typography.Paragraph className="empty-chat__subtitle">
                    Respondo con lo que tengo en mi archivo de rock nacional. Si no lo sé, te lo digo.
                </Typography.Paragraph>

                <div className="empty-chat__suggestions">
                    {suggestions.map((question) => (
                        <Button
                            key={question}
                            className="empty-chat__suggestion"
                            disabled={disabled}
                            onClick={() => onPick(question)}
                        >
                            {question}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
