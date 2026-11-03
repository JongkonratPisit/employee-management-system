/** @type { import('@storybook/react-vite').Preview } */
import { mswLoader } from 'msw-storybook-addon/csf3'
import '../src/index.css'

const preview = {
    loaders: [mswLoader()],
    decorators: [
            (Story) => (
                <div style={{ padding: '20px', background: '#f3f0ff' }}>
                    <Story />
                </div>
            ),
        ],

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