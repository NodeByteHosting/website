/**
 * Page tree types
 */
export type TreeNode = FileNode | Separator | FolderNode;

export interface FileNode {
    type: 'file';
    name: string;
    url: string;
    title?: string;
}

export interface Separator {
    type: 'separator';
    name: string;
}

export interface FolderNode {
    type: 'folder';
    name: string;
    children: TreeNode[];
}

/**
 * Table of Contents types
 */
export interface TOCItem {
    title: string;
    url: string;
    items?: TOCItem[];
}

export type TableOfContents = TOCItem[];

/**
 * Documentation types
 */
export interface Doc {
    title: string;
    content: string;
    url: string;
    section?: string;
}

/**
 * Active anchor type for TOC
 */
export type ActiveAnchor = Record<string, {
    isActive?: boolean;
    aboveHalfViewport: boolean;
    index: number;
    insideHalfViewport: boolean;
}>;

/**
 * Error logging types
 */
export interface LogErrorProps {
    message: string;
    error?: Error;
    context?: Record<string, unknown>;
}
