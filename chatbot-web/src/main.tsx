import { App as AntApp, ConfigProvider } from 'antd';
import esES from 'antd/locale/es_ES';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/auth/AuthProvider';
import './styles/global.css';
import { oktubreTheme } from './theme/oktubreTheme';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ConfigProvider theme={oktubreTheme} locale={esES}>
            <AntApp>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </AntApp>
        </ConfigProvider>
    </StrictMode>,
);
