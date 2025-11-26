export const getVersion = () => {
    const isNightly = process.env.IS_NIGHTLY === 'true';
    const version = process.env.VERSION || 'unknown';
    const sha = process.env.SHA?.substring(0, 7) || 'dev';
    const buildEnv = process.env.BUILD_ENV?.substring(0, 4) || 'dev';
    const buildDate = process.env.BUILD_DATE || '';
    const versionTag = process.env.VERSION_TAG || 'development';

    if (isNightly) {
        return `v${version}-${sha}-nightly-${buildDate}`;
    }

    return `v${version}-${sha}-${buildEnv}`;
};

export const getBuildInfo = () => ({
    version: process.env.VERSION,
    isNightly: process.env.IS_NIGHTLY === 'true',
    buildDate: process.env.BUILD_DATE,
    versionTag: process.env.VERSION_TAG,
    sha: process.env.SHA,
    buildEnv: process.env.BUILD_ENV
});