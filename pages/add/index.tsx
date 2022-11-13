'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Product } from '../../types/productTypes';
import { Button } from '@mantine/core';
import FormForCreate from './_createForm';
import FormForAdd from './_addItem';
import { IconArrowBack } from '@tabler/icons';
import { useForceUpdate } from '@mantine/hooks';
import Link from 'next/link';

const BarcodeScannerComponent = dynamic(() => import('../../components/barcode'), {
    ssr: false,
});

export default function addItem() {
    const [prodIt, setProdIt] = useState('Scanning Items...');
    const [prodData, setProdData] = useState<Product | null>();
    const [needCreate, setNeedCreate] = useState(false);

    const [showAdd, setShowAdd] = useState(false);

    const [showCreate, setShowCreate] = useState(false);
    const forceUpdate = useForceUpdate();

    let onUpdate = async (data: string) => {
        setProdIt(data);
        let dataOut = await axios.get<Product | null>('/api/lookupProd?id=' + data);
        setProdData(dataOut.data);
        if (dataOut.data == null) {
            setNeedCreate(true);
        }
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

            {showAdd === true ? (
                <>
                    <div>
                        <strong>Product Name:</strong> <span className="text-neutral-400">{prodData?.Name}</span>
                    </div>
                    <FormForAdd
                        prodId={`${prodIt}`}
                        nextPage={() => {
                            window.location.reload();
                        }}
                    />
                </>
            ) : showCreate === true ? (
                <>
                    <h1>Creating</h1>
                    <div className="flex-1 w-full flex items-center justify-center">
                        <FormForCreate
                            prodId={`${prodIt}`}
                            nextPage={() => {
                                setShowAdd(true);
                            }}
                        />
                    </div>
                </>
            ) : (
                <>
                    <h1>Add item!</h1>

                    <BarcodeScannerComponent update={(data: string) => onUpdate(data)} />
                    <div className="flex-1"></div>
                    {prodIt !== 'Scanning Items...' && <p>Scanned Product With ID: {prodIt}</p>}
                    {prodData ? (
                        <div className="flex flex-col items-center justify-center flex-1">
                            <p className="mb-6">
                                <strong>Product Name:</strong> <span className="text-neutral-400">{prodData.Name}</span>
                            </p>
                            <Button
                                onClick={() => {
                                    setShowAdd(true);
                                }}
                            >
                                Add Item
                            </Button>
                        </div>
                    ) : (
                        needCreate && (
                            <div className="flex flex-col items-center justify-center">
                                <Button onClick={() => setShowCreate(true)}>Create Item</Button>
                            </div>
                        )
                    )}
                </>
            )}
        </div>
    );
}
