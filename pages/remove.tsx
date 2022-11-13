'use client';
import { Button, Modal, NumberInput, Paper, ScrollArea } from '@mantine/core';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { IconArrowBack } from '@tabler/icons';
import { use, useEffect, useState } from 'react';
import { ProductItem } from '../types/productTypes';
import axios from 'axios';
import { useForm } from '@mantine/form';

const BarcodeScannerComponent = dynamic(() => import('../components/barcode'), {
    ssr: false,
});

export default function removeItems() {
    const [prodIt, setProdIt] = useState('Scanning Items...');
    const [prods, setProds] = useState<ProductItem[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState<ProductItem>();
    const [debounce, setDebounce] = useState(false);

    let onUpdate = async (data: string) => {
        setProdIt(data);

        let dataOut = await axios.get<ProductItem[] | null>('/api/getProds?id=' + data);
        setProds(dataOut.data ?? []);
        console.log(dataOut.data ?? []);
    };

    const form = useForm({
        initialValues: {
            QuantityLeft: data?.QuantityLeft,
            WeightLeft: data?.WeightLeft,
        },
        validateInputOnBlur: true,

        // functions will be used to validate values at corresponding key
        validate: {
            QuantityLeft: (value: number) => (value < 0 ? 'Quantity must be positive' : null),
            WeightLeft: (value: number) => (value < 0 ? 'Weight must be positive' : null),
        },
    });

    let submitted = () => {};

    return (
        <div className="flex h-[95vh] w-[100vw] flex-col items-center justify-around">
            <div className="absolute top-0 left-0 m-2">
                <Link href="/">
                    <Button>
                        <IconArrowBack />
                    </Button>
                </Link>
            </div>
            <>
                <h1>Remove item!</h1>
                <BarcodeScannerComponent update={(data: string) => onUpdate(data)} />
                <div className="flex-1"></div>
                {prodIt !== 'Scanning Items...' && <p>Scanned Product With ID: {prodIt}</p>}
                <div className="flex flex-col items-center justify-center">
                    <ScrollArea className="w-[80vw] h-[30vh] flex items-center">
                        <h3 className="text-center w-full">
                            <strong>Select Best Before Date</strong>
                        </h3>

                        {prods.length === 0 ? (
                            <>{prodIt !== 'Scanning Items...' && <p className="text-center w-full mt-10">No Product in inventory</p>}</>
                        ) : (
                            prods.map((prod) => {
                                let newDate = new Date(prod.BestbeforeDate);
                                let day = newDate.getDate();
                                let month = newDate.getMonth() + 1;
                                let year = newDate.getFullYear();
                                return (
                                    <div key={prod.UUID}>
                                        <Paper withBorder shadow={'md'} className="p-3 mt-3 flex justify-between">
                                            <div className="w-full flex justify-between items-center">
                                                <p style={{ flexGrow: 1 }}>
                                                    <strong>Date:</strong>{' '}
                                                    <span className="text-neutral-400">
                                                        {day}/{month}/{year}
                                                    </span>
                                                </p>
                                                <Button
                                                    style={{ backgroundColor: '#40C057', marginRight: '10px' }}
                                                    className="Nope"
                                                    onClick={() => {
                                                        setShowModal(true);
                                                        form.setValues({
                                                            QuantityLeft: prod.QuantityLeft,
                                                            WeightLeft: prod.WeightLeft,
                                                        });
                                                        setData(prod);
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    style={{ backgroundColor: '#E03131' }}
                                                    className="Nope"
                                                    onClick={() => {
                                                        axios.get('/api/removePurchase?id=' + prod.UUID);
                                                        setProds((prodsIN) => prodsIN.filter((item: ProductItem) => item.UUID !== prod.UUID));
                                                    }}
                                                >
                                                    X
                                                </Button>
                                            </div>
                                        </Paper>
                                    </div>
                                );
                            })
                        )}
                    </ScrollArea>
                </div>

                <Modal opened={showModal} onClose={() => setShowModal(false)} title="Edit Product!">
                    <form onSubmit={form.onSubmit(submitted)} className="w-[100%]">
                        <NumberInput mt="sm" label="Quantity" placeholder="Quantity" min={0} max={100} {...form.getInputProps('QuantityLeft')} />
                        <NumberInput mt="sm" label="Weight" placeholder="Weight" min={0} max={1000} precision={2} {...form.getInputProps('WeightLeft')} />

                        <Button
                            mt="sm"
                            type="submit"
                            variant="outline"
                            color="white"
                            style={{ color: 'white', width: '80vw', marginTop: '40px' }}
                            onClick={() => {
                                if (debounce) return;
                                setDebounce(true);
                                axios
                                    .post('/api/UpdateWeightQuanity', {
                                        id: data?.UUID ?? '',
                                        WeightLeft: form.values.WeightLeft,
                                        QuantityLeft: form.values.QuantityLeft,
                                    })
                                    .then(() => {
                                        setShowModal(false);
                                        onUpdate(prodIt);
                                    })
                                    .finally(() => {
                                        setDebounce(false);
                                    });
                            }}
                        >
                            Update Product
                        </Button>
                    </form>
                </Modal>
            </>
        </div>
    );
}
