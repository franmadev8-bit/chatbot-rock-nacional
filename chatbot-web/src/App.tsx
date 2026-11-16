import { Spin } from 'antd';
import { useAuth } from './contexts/auth/useAuth';
import { ChatView } from './views/ChatView';
import { LoginView } from './views/LoginView';

export default function App() {
    const { user, checking } = useAuth();

    if (checking) {
        return (
            <div className="app-loading">
                <Spin size="large" />
            </div>
        );
    }

    return user ? <ChatView /> : <LoginView />;
}
