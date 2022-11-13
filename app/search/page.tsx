'use client';
import { Button, Select } from '@mantine/core';
import Link from 'next/link';
import { IconArrowBack } from '@tabler/icons';
import axios from 'axios';
import { useState } from 'react';
import { Product } from '../../types/productTypes';
import Image from 'next/image';

export default function SearchProduct() {
    const [options, setOptions] = useState<string[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product>();
    const [productData, setProdData] = useState<any>({});
    const [showDetails, setShowDetails] = useState<{
        WeightLeft: number;
        QuantityLeft: number;
    }>();

    const search = async (stringIn: String) => {
        axios.get('/api/search?id=' + stringIn).then((data) => {
            if (data.data.product.length === 0) return;
            let productState: any = {};
            data.data.product.forEach((e: any) => {
                productState[e.prodId] = e;
            });
            setProdData(productState);
            setOptions(
                data.data.product.map((e: Product) => {
                    return { label: e.Name, value: e.prodId };
                }),
            );
        });
    };

    return (
        <div className="flex h-[95vh] w-[100vw] flex-col items-center justify-around mt-[2vh]">
            <div className="absolute top-0 left-0 m-2">
                <Link href="/">
                    <Button>
                        <IconArrowBack />
                    </Button>
                </Link>
            </div>
            <h1>Search Item</h1>
            <div className=" w-[90vw] flex-1  items-center flex flex-col h-[80%] ">
                <div className="flex flex-col justify-center" style={{ flexGrow: '1' }}>
                    {selectedProduct !== undefined && (
                        <div className="pt-[10%] flex flex-col justify-center items-center">
                            <Image src={selectedProduct.Image} width={400} height={400} alt="photo" />
                            <h1 className="text-4xl">{selectedProduct.Name}</h1>
                            {showDetails !== undefined && (
                                <>
                                    <p>
                                        <strong>Total Weight Left:</strong> <span className="text-neutral-400">{showDetails?.WeightLeft}</span>
                                    </p>
                                    <p>
                                        <strong>Total Quantity Left:</strong> <span className="text-neutral-400">{showDetails?.QuantityLeft}</span>
                                    </p>
                                    <p>
                                        <strong>From:</strong> <span className="text-neutral-400">{selectedProduct?.Where}</span>
                                    </p>
                                    <p>
                                        <strong>Price:</strong> <span className="text-neutral-400">£{selectedProduct?.Price}</span>
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>
                <Select
                    label="Search For Product"
                    placeholder="Start Typing"
                    className="w-[100%]"
                    data={options}
                    searchable
                    onInput={(e: any) => {
                        search(e.target.value);
                        console.log(e.target.value);
                    }}
                    onChange={(e: any) => {
                        axios.get('/api/fetchDetails?id=' + e).then((data) => {
                            setShowDetails(data.data.product[0]);
                        });
                        setSelectedProduct(productData[e]);
                    }}
                />
            </div>
        </div>
    );
}
