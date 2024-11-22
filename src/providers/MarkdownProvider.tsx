import React from 'react';
import md from 'markdown-it';
import markdownItIcon from './MarkdownIt/Provider';
import markdownItRehype from './MarkdownIt/RehypeProvider';

const markdown = md().use(markdownItIcon);

export const MarkdownProvider: React.FC<{ content: string }> = ({ content }) => {
    return (
        <div
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: markdown.render(content) }}
        />
    );
};