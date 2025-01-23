import type { Meta, StoryObj } from '@storybook/react';
import { mockData } from './mock';
import { Table } from './table';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Table> = {
    title: 'Table',
    component: Table,
    render: (args) => (
        <Table {...args}>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th scope="col">ID</Table.Th>
                    <Table.Th scope="col">Name</Table.Th>
                    <Table.Th scope="col">Age</Table.Th>
                    <Table.Th scope="col">Email</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {mockData.map((item) => (
                    <Table.Tr key={item.id}>
                        <Table.Th scope="row">{item.id}</Table.Th>
                        <Table.Td>{item.name}</Table.Td>
                        <Table.Td>{item.age}</Table.Td>
                        <Table.Td>{item.email}</Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
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

type Story = StoryObj<typeof Table>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
    args: {
        caption: 'Active users',
    },
};
