export const stripHtmlTags = (str: string): string => {
    if (!str) return '';
    return str.replace(/<\/?[^>]+(>|$)/g, '');
};