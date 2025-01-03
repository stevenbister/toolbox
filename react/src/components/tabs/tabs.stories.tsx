import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './tabs';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Tabs> = {
    title: 'Tabs',
    component: Tabs,
    render: (args) => (
        <Tabs {...args}>
            <Tabs.List>
                <Tabs.Trigger>Tab 1</Tabs.Trigger>
                <Tabs.Trigger>Tab 2</Tabs.Trigger>
                <Tabs.Trigger>Tab 3</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Panel>Panel 1</Tabs.Panel>
            <Tabs.Panel>Panel 2</Tabs.Panel>
            <Tabs.Panel>Panel 3</Tabs.Panel>
        </Tabs>
    ),
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

type Story = StoryObj<typeof Tabs>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
    args: {},
};
