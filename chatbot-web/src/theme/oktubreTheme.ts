import { theme, type ThemeConfig } from 'antd';

export const palette = {
    black: '#0a0a0a',
    deep: '#050505',
    surface: '#1b1b1b',
    surfaceRaised: '#242424',
    border: '#2d2d2d',
    red: '#c4161c',
    redHover: '#e2262c',
    cream: '#f3eee4',
    muted: '#9a948a',
};

export const oktubreTheme: ThemeConfig = {
    algorithm: theme.darkAlgorithm,
    token: {
        colorPrimary: palette.red,
        colorLink: palette.red,
        colorLinkHover: palette.redHover,
        colorBgBase: palette.black,
        colorTextBase: palette.cream,
        colorBgContainer: palette.surface,
        colorBgElevated: palette.surfaceRaised,
        colorBorder: palette.border,
        colorBorderSecondary: palette.border,
        colorTextSecondary: palette.muted,
        borderRadius: 10,
        fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
    },
    components: {
        Layout: {
            headerBg: palette.deep,
            headerHeight: 64,
            headerPadding: '0 20px',
            siderBg: palette.deep,
            bodyBg: palette.black,
        },
        Menu: {
            darkItemBg: palette.deep,
            darkItemColor: palette.muted,
            darkItemHoverBg: '#141414',
            darkItemHoverColor: palette.cream,
            darkItemSelectedBg: palette.surface,
            darkItemSelectedColor: palette.cream,
            itemBorderRadius: 8,
            itemMarginInline: 8,
        },
        Button: {
            primaryShadow: 'none',
            fontWeight: 600,
        },
        Input: {
            activeShadow: '0 0 0 2px rgba(196, 22, 28, 0.25)',
        },
    },
};
