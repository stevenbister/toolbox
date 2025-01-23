import { render, screen } from '@testing-library/react';
import { mockData } from './mock';
import { Table, type TableProps } from './table';

const mockCaption = 'Active users';

const setup = (props?: Partial<TableProps>) =>
    render(
        <Table caption={props?.caption ?? mockCaption} {...props}>
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
    );

beforeEach(() => vi.resetAllMocks());

it('renders the component with the correct roles', () => {
    setup();

    expect(screen.getByRole('region')).toHaveAccessibleName(mockCaption);
    expect(screen.getByRole('table')).toHaveAccessibleName(mockCaption);
    expect(screen.getByRole('caption')).toBeInTheDocument();

    expect(screen.getAllByRole('rowgroup')).toHaveLength(2);
    expect(screen.getAllByRole('rowheader')).toHaveLength(mockData.length);
    expect(screen.getAllByRole('row')).toHaveLength(mockData.length + 1);

    expect(screen.getAllByRole('columnheader')).toHaveLength(
        mockData.length + 1
    );

    expect(screen.getAllByRole('cell')).toHaveLength(mockData.length * 3);
});
