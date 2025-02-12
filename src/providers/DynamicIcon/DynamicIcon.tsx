import { FC } from 'react';
import { iconLibraries } from './libraries';

interface DynamicIconProps {
    iconName: string;
    size?: number;
    color?: string;
}

/**
 * Dynamic React Icon component
 * @description Dynamically render a React Icon component based on the icon name
 * @param {string} iconName - The name of the icon to render
 * @param {number} [size=24] - The size of the icon
 * @param {string} [color='currentColor'] - The color of the icon
 * @returns {ReactElement} - The React Icon component
 */
export const DynamicIcon: FC<DynamicIconProps> = ({ iconName, size = 24, color = 'currentColor' }) => {
    const IconComponent = iconLibraries[iconName as keyof typeof iconLibraries] as FC<{ size?: number; color?: string }>;

    if (!IconComponent) return null;

    return <IconComponent size={size} color={color} />;
};