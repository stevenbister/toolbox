/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
    stories: ['../stories/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
    addons: [
        '@storybook/addon-onboarding',
        '@storybook/addon-essentials',
        '@chromatic-com/storybook',
        '@storybook/addon-interactions',
        '@storybook/addon-a11y'
    ],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
};
export default config;
