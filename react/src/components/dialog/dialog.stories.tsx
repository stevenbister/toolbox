import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from './dialog';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Dialog> = {
    title: 'Dialog',
    component: Dialog,
    render: (args) => (
        <Dialog {...args}>
            <Dialog.Trigger>Open dialog</Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Title>Dialog title</Dialog.Title>
                <Dialog.Close>Close</Dialog.Close>
                <form method="dialog">
                    <label htmlFor="firstName">First name</label>
                    <input id="firstName" name="firstName" type="text" />
                    <label htmlFor="lastName">Last name</label>
                    <input id="lastName" name="lastName" type="text" />
                    <button>submit</button>
                </form>
            </Dialog.Content>
        </Dialog>
    ),
    decorators: [
        (Story) => (
            <div style={{ height: '200vh' }}>
                <Story />
            </div>
        ),
    ],
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {},
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    args: {},
};
export default meta;

type Story = StoryObj<typeof Dialog>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
    args: {},
};
