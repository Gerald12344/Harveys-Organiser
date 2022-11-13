import { Table } from '@mantine/core';
import { Product } from '../../types/productTypes';

interface ShoppingListProps {
    elements: Product[];
}
export default function MainTable({ elements }: ShoppingListProps) {
    let total = 0;
    const rows = elements.map((element) => {
        total += element.Price;
        return (
            <tr key={element.prodId}>
                <td>{element.Name}</td>
                <td>£{element.Price}</td>
            </tr>
        );
    });

    return (
        <Table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                {rows}
                <tr key={'MAIN_TOTALS'}>
                    <td>
                        <strong>Total</strong>
                    </td>
                    <td>
                        <strong>£{total}</strong>
                    </td>
                </tr>
            </tbody>
        </Table>
    );
}
