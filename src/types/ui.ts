import { DialogProps } from '@radix-ui/react-dialog';
import type { EmblaCarouselType as CarouselType } from 'embla-carousel';
import type { EmblaOptionsType as CarouselOptions, EmblaPluginType as CarouselPlugin } from 'embla-carousel';
import type { UseEmblaCarouselType } from 'embla-carousel-react';

/**
 * Logo component props
 */
export type LogoProps = Record<string, never>;

/**
 * Input component props
 */
export interface InputProps {
    type?: string;
    placeholder?: string;
    className?: string;
    [key: string]: unknown;
}

/**
 * Form item context value
 */
export interface FormItemContextValue {
    id: string;
}

/**
 * Carousel related types
 */
export type CarouselApi = CarouselType;
export type CarouselViewportRef = UseEmblaCarouselType[0];

export interface CarouselProps {
    opts?: CarouselOptions;
    plugins?: CarouselPlugin[];
    orientation?: 'horizontal' | 'vertical';
    setApi?: (api: CarouselApi) => void;
}

export interface CarouselContextProps extends Pick<CarouselProps, 'orientation' | 'opts'> {
    carouselRef: CarouselViewportRef;
    api: CarouselApi | undefined;
    scrollPrev: () => void;
    scrollNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
}

/**
 * Breadcrumb item type
 */
export interface BreadcrumbItem {
    label: string;
    href: string;
    active?: boolean;
}

/**
 * Button types
 */
export interface ButtonProps {
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
}

export interface GradientButtonProps extends ButtonProps {
    gradient?: 'primary' | 'secondary' | 'accent';
}

/**
 * Command dialog props
 */
export interface CommandDialogProps extends DialogProps {}
