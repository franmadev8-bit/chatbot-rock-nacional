import { Fragment, type ReactNode } from 'react';

const INLINE_PATTERN = /(\*\*[^*]+\*\*|\*[^*\n]+\*)/g;

function renderInline(text: string): ReactNode[] {
    return text.split(INLINE_PATTERN).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
            return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <Fragment key={i}>{part}</Fragment>;
    });
}

export function FormattedText({ text }: { text: string }) {
    const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim());

    return (
        <div className="message-bubble__text">
            {paragraphs.map((paragraph, i) => (
                <p key={i}>
                    {paragraph.split('\n').map((line, j) => (
                        <Fragment key={j}>
                            {j > 0 && <br />}
                            {renderInline(line)}
                        </Fragment>
                    ))}
                </p>
            ))}
        </div>
    );
}
