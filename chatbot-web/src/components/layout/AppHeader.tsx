import { LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { Avatar, Button, Layout, Tooltip } from 'antd';
import { useHeaderViewModel } from '../../hooks/useHeaderViewModel';
import { palette } from '../../theme/oktubreTheme';
import { Brand } from '../brand/Brand';

interface AppHeaderProps {
    showMenuButton: boolean;
    onMenuClick: () => void;
}

export function AppHeader({ showMenuButton, onMenuClick }: AppHeaderProps) {
    const { userName, initial, signOut } = useHeaderViewModel();

    return (
        <Layout.Header className="app-header">
            <div className="app-header__left">
                {showMenuButton && (
                    <Button type="text" icon={<MenuOutlined />} onClick={onMenuClick} aria-label="Abrir historial" />
                )}
                <Brand />
            </div>

            <div className="app-header__user">
                <span className="app-header__name">{userName}</span>
                <Avatar style={{ background: palette.red, fontWeight: 700 }}>{initial}</Avatar>
                <Tooltip title="Cerrar sesión">
                    <Button type="text" icon={<LogoutOutlined />} onClick={() => void signOut()} aria-label="Cerrar sesión" />
                </Tooltip>
            </div>
        </Layout.Header>
    );
}
