import MarkdownIt from 'markdown-it';
import { Icon } from '@iconify-icon/react';
import ReactDOMServer from 'react-dom/server';

/**
 * A markdown-it plugin that allows the use of the Icon component in markdown.
 * @copyright 2024 Toxic Dev <https://toxicdev.me>
 */
const markdownItIcon = (md: MarkdownIt) => {
    const defaultRender = md.renderer.rules.text || function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.text = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        const iconRegex = /<Icon title="([^"]+)" class="([^"]+)" icon="([^"]+)" \/>/g;
        const parts = [];
        let lastIndex = 0;

        token.content.replace(iconRegex, (match, title, className, icon, offset) => {
            parts.push(token.content.slice(lastIndex, offset));
            const iconElement = <Icon title={title} className={className} icon={icon} />;
            parts.push(ReactDOMServer.renderToString(iconElement));
            lastIndex = offset + match.length;
            return ''; // Return an empty string to satisfy the replace method's requirement
        });

        parts.push(token.content.slice(lastIndex));

        return parts.join('');
    };
};

export default markdownItIcon;