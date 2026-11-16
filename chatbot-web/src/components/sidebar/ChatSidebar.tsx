import { MessageOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Menu, Skeleton } from 'antd';
import { useSidebarViewModel } from '../../hooks/useSidebarViewModel';

interface ChatSidebarProps {
    onNavigate?: () => void;
}

export function ChatSidebar({ onNavigate }: ChatSidebarProps) {
    const { chats, activeChatId, loading, disabled, selectChat, newChat } = useSidebarViewModel(onNavigate);

    const items = chats.map((chat) => ({
        key: chat.id,
        icon: <MessageOutlined />,
        label: chat.title,
        title: chat.title,
        disabled,
    }));

    return (
        <>
            <div className="chat-sidebar__top">
                <Button type="primary" icon={<PlusOutlined />} block size="large" onClick={newChat} disabled={disabled}>
                    Nuevo chat
                </Button>
            </div>

            <div className="chat-sidebar__label">Historial</div>

            <div className="chat-sidebar__list">
                {loading && <Skeleton active paragraph={{ rows: 5 }} title={false} style={{ padding: '8px 24px' }} />}

                {!loading && chats.length === 0 && (
                    <Empty
                        className="chat-sidebar__empty"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Todavía no tenés chats."
                    />
                )}

                {chats.length > 0 && (
                    <Menu
                        theme="dark"
                        mode="inline"
                        items={items}
                        selectedKeys={activeChatId ? [activeChatId] : []}
                        onClick={({ key }) => selectChat(key)}
                    />
                )}
            </div>
        </>
    );
}
