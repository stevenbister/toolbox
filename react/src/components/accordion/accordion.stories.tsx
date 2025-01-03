import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './accordion';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Accordion> = {
    title: 'Accordion',
    component: Accordion,
    render: (args) => (
        <Accordion {...args}>
            <Accordion.Item name="ac-one">
                <Accordion.Trigger>Accordion one</Accordion.Trigger>
                <Accordion.Panel>Accordion panel one</Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item name="ac-two">
                <Accordion.Trigger>Accordion two</Accordion.Trigger>
                <Accordion.Panel>Accordion panel two</Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item name="ac-three">
                <Accordion.Trigger>Accordion three</Accordion.Trigger>
                <Accordion.Panel>Accordion panel three</Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    ),
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        type: {
            control: 'select',
            options: ['single', 'multiple'],
        },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    args: {},
};
export default meta;

type Story = StoryObj<typeof Accordion>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
    args: {
        defaultOpen: ['ac-one'],
    },
};

export const Collapsible: Story = {
    args: {
        collapsible: true,
    },
};

export const Multiple: Story = {
    args: {
        ...Collapsible.args,
        type: 'multiple',
    },
};
