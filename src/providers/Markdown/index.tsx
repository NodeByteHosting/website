import React from 'react';
import md from 'markdown-it';
import markdownItIcon from '../MarkdownIt';
import markdownItRehype from '../Rehype';

const markdown = md({
    html: true,
    linkify: true,
    typographer: true
}).use(markdownItIcon);

export const MarkdownProvider: React.FC<{ content: string }> = ({ content }) => {
    return (
        <div
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: markdown.render(content) }}
        />
    );
};