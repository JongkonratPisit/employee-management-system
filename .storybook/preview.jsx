/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  decorators: [
        (Story) => (
            <div style={{ padding: '20px', background: '#f3f0ff' }}>
                <Story />
            </div>
        ),
    ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },

  parameters: {
        layout: 'centered',

        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;