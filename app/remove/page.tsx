'use client';
import { Button, Paper, ScrollArea } from '@mantine/core';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { IconArrowBack } from '@tabler/icons';
import { useState } from 'react';
import { ProductItem } from '../../types/productTypes';
import axios from 'axios';

const BarcodeScannerComponent = dynamic(() => import('../../components/barcode'), {
    ssr: false,
});

export default function removeItems() {
    const [prodIt, setProdIt] = useState('Scanning Items...');
    const [prods, setProds] = useState<ProductItem[]>([]);

    const audio = new Audio('Sound.wav');

    let onUpdate = async (data: string) => {
        audio.play();
        setProdIt(data);

        let dataOut = await axios.get<ProductItem[] | null>('/api/getProds?id=' + data);
        setProds(dataOut.data ?? []);
        console.log(dataOut.data ?? []);
    };

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
                                                <p>
                                                    <strong>DOB:</strong>{' '}
                                                    <span className="text-neutral-400">
                                                        {day}/{month}/{year}
                                                    </span>
                                                </p>
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
            </>
        </div>
    );
}
