import MarkdownIt from 'markdown-it';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';

const markdownItRehype = (md: MarkdownIt) => {
    const defaultRender = md.renderer.rules.text || function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.text = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        const processor = unified()
            .use(rehypeParse, { fragment: true })
            .use(remarkGfm)
            .use(rehypeStringify);

        let result = '';
        processor.process(token.content).then(file => {
            result = String(file);
        }).catch(error => {
            console.error(error);
            result = token.content;
        });

        return result;
    };
};

export default markdownItRehype;