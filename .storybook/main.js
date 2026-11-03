
/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: ['@storybook/addon-docs'],
  framework: "@storybook/react-vite",
  staticDirs: ['../public'],
};

export default config;