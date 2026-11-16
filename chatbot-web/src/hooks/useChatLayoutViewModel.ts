import { Grid } from 'antd';
import { useState } from 'react';

export function useChatLayoutViewModel() {
    const screens = Grid.useBreakpoint();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const isMobile = !screens.lg;

    return {
        isMobile,
        drawerOpen: isMobile && drawerOpen,
        openDrawer: () => setDrawerOpen(true),
        closeDrawer: () => setDrawerOpen(false),
    };
}
