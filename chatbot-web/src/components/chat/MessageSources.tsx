import { Tag, Tooltip } from 'antd';
import type { RagSource } from '../../models/chat';

export function MessageSources({ sources }: { sources: RagSource[] }) {
    if (sources.length === 0) return null;

    return (
        <div className="message-sources">
            {sources.map((source) => (
                <Tooltip key={source.id} title={`Relevancia: ${source.score.toFixed(2)}`}>
                    <Tag variant="filled" color="red">
                        {source.topic} · {source.section}
                    </Tag>
                </Tooltip>
            ))}
        </div>
    );
}
