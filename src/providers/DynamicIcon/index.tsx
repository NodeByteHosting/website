import { FC } from 'react';
import { iconLibraries } from './libraries';
import type { DynamicIconProps } from 'types/providers';

/**
 * Dynamic React Icon component
 * @description Dynamically render a React Icon component based on the icon name
 * @param {string} name - The name of the icon to render
 * @param {number} [size=24] - The size of the icon
 * @param {string} [className] - Additional CSS classes
 * @returns {ReactElement} - The React Icon component
 */
export const DynamicIcon: FC<DynamicIconProps> = ({ name, size = 24, className }) => {
    const IconComponent = iconLibraries[name as keyof typeof iconLibraries] as FC<{ size?: number; className?: string }>;

    if (!IconComponent) return null;

    return <IconComponent size={size} className={className} />;
};