import { Drawer, Layout } from 'antd';
import { ChatPanel } from '../components/chat/ChatPanel';
import { AppHeader } from '../components/layout/AppHeader';
import { ChatSidebar } from '../components/sidebar/ChatSidebar';
import { ChatProvider } from '../contexts/chat/ChatProvider';
import { useChatLayoutViewModel } from '../hooks/useChatLayoutViewModel';

const SIDEBAR_WIDTH = 280;

export function ChatView() {
    const { isMobile, drawerOpen, openDrawer, closeDrawer } = useChatLayoutViewModel();

    return (
        <ChatProvider>
            <Layout className="app-shell">
                <AppHeader showMenuButton={isMobile} onMenuClick={openDrawer} />

                <Layout className="app-body">
                    {isMobile ? (
                        <Drawer
                            placement="left"
                            open={drawerOpen}
                            onClose={closeDrawer}
                            size={SIDEBAR_WIDTH}
                            closable={false}
                            rootClassName="chat-sidebar__drawer"
                        >
                            <ChatSidebar onNavigate={closeDrawer} />
                        </Drawer>
                    ) : (
                        <Layout.Sider width={SIDEBAR_WIDTH} className="chat-sidebar">
                            <ChatSidebar />
                        </Layout.Sider>
                    )}

                    <Layout.Content>
                        <ChatPanel />
                    </Layout.Content>
                </Layout>
            </Layout>
        </ChatProvider>
    );
}
