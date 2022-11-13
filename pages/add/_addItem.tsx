'use client';
import { useForm } from '@mantine/form';
import { NumberInput, TextInput, Button, Select } from '@mantine/core';
import { Category, CategoryList, Product, ProductItem } from '../../types/productTypes';
import ImageUpload from './_ImageUpload';
import axios from 'axios';
import { v4 } from 'uuid';
import { DatePicker } from '@mantine/dates';

const defaultValues: ProductItem = {
    BestbeforeDate: 0,
    prodId: '',
    PurchaseDate: Date.now(),
    QuantityLeft: 0,
    WeightLeft: 0,
    UUID: v4(),
    inStock: true,
};

export default function FormForAdd({ prodId, nextPage }: { prodId: string; nextPage: () => void }) {
    let submitted = async () => {
        await axios.post('/api/addProd', {
            ...form.values,
            prodId,
            BestbeforeDate: new Date(form.values.BestbeforeDate).valueOf(),
            PurchaseDate: new Date(form.values.PurchaseDate).valueOf(),
            UUID: v4(),
        });
        nextPage();
    };

    const form = useForm({
        initialValues: defaultValues,
        validateInputOnBlur: true,

        // functions will be used to validate values at corresponding key
        validate: {
            BestbeforeDate: (value: number) => (value < 0 ? 'Best before date must be positive' : null),
        },
    });

    return (
        <form onSubmit={form.onSubmit(submitted)} className="w-[80%]">
            <DatePicker placeholder="Best Before Date" label="Best Before Date" {...form.getInputProps('BestbeforeDate')} />

            <Button mt="sm" type="submit" variant="outline" color="white" style={{ color: 'white', width: '80vw', marginTop: '40px' }}>
                Add Product
            </Button>
        </form>
    );
}
