import { useForm } from '@mantine/form';
import { NumberInput, TextInput, Button, Select, Switch } from '@mantine/core';
import { Category, CategoryList, Product, WhereList } from '../../types/productTypes';
import ImageUpload from './_ImageUpload';
import axios from 'axios';

const defaultValues: Product = {
    Name: '',
    Price: 0,
    Quantity: 1,
    Weight: 0,
    Category: 'Other',
    CuboardEssntial: false,
    prodId: '',
    Image: '',
    Where: 'Aldi',
};

export default function FormForCreate({ prodId, nextPage }: { prodId: string; nextPage: (name: string) => void }) {
    let submitted = async () => {
        await axios.post('/api/createProd', { ...form.values, prodId });
        nextPage(form?.values?.Name as any);
    };

    const form = useForm({
        initialValues: defaultValues,
        validateInputOnBlur: true,

        // functions will be used to validate values at corresponding key
        validate: {
            Name: (value: string) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            Price: (value: number) => (value < 0 ? 'Price must be positive' : null),
            Category: (value: Category) => (CategoryList.includes(value) === false ? 'Must pick a category' : null),
            Weight: (value: number) => (value < 0 ? 'Weight must be positive' : null),
            Quantity: (value: number) => (value < 0 ? 'Quantity must be positive' : null),
            Image: (value: string) => (value.length < 1 ? 'Image must be uploaded' : null),
            Where: (value: string) => (value.length < 1 ? 'Where must be selected' : null),
        },
    });

    return (
        <form onSubmit={form.onSubmit(submitted)} className="w-[80%]">
            <TextInput label="Name" placeholder="Name" {...form.getInputProps('Name')} />
            <NumberInput mt="sm" label="Price" placeholder="Price" min={0} max={100} {...form.getInputProps('Price')} />

            <Select label="Category" mt="sm" placeholder="Category" data={CategoryList} {...form.getInputProps('Category')} />

            <NumberInput mt="sm" label="Weight" placeholder="Weight" min={0} precision={2} max={1000} {...form.getInputProps('Weight')} />
            <NumberInput mt="sm" label="Quantity" placeholder="Quantity" min={0} max={1000} {...form.getInputProps('Quantity')} />

            <Switch mt="sm" label="Cuboard Essential" {...form.getInputProps('CuboardEssntial')} />

            <Select label="Where" mt="sm" placeholder="Where" data={WhereList} {...form.getInputProps('Where')} />

            <ImageUpload
                {...form.getInputProps('Image')}
                setImages={(image: string) => {
                    form.setFieldValue('Image', image);
                }}
            />

            <Button mt="sm" type="submit" variant="outline" color="white" style={{ color: 'white', width: '80vw', marginTop: '10px' }}>
                Add Product
            </Button>
        </form>
    );
}
