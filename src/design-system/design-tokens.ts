import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export const tokens = {
    colors,
    typography,
    spacing,
    shadows: {
        card: '0 4px 12px rgba(0, 0, 0, 0.05)',
        button: '0 4px 14px rgba(230, 30, 77, 0.3)', // Soft shadow with primary tint
    },
    borderRadius: {
        badge: '9999px',
        button: '9999px',
        card: '16px',
        image: '12px',
    }
};
