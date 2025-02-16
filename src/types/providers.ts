import { ReactNode, RefObject } from 'react';

/**
 * SWR Provider props
 */
export interface SWRProviderProps {
    children: ReactNode;
}

/**
 * Modal context interface
 * Matches the return type of NextUI's useDisclosure hook
 */
export interface ModalContext {
    isOpen: boolean;
    onOpen: () => void;
    onOpenChange: () => void;
    onClose: () => void;
}

/**
 * Dynamic Icon props
 */
export interface DynamicIconProps {
    name?: string;
    iconName: string;
    size?: number;
    color?: string;
}


/**
 * Button Scroll context
 */
export interface ButtonScrollContext {
    targetRef: RefObject<HTMLDivElement>;
    scrollToElement: () => void;
}
