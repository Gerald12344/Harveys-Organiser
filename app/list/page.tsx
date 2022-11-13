'use client';

import { Button, Paper, Select } from '@mantine/core';
import { IconArrowBack } from '@tabler/icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Category, CategoryList, Product, ProductItem } from '../../types/productTypes';
import axios from 'axios';
import Image from 'next/image';

interface lookup {
    [key: string]: Product;
}

export default function listAll() {
    const [prodData, setProdData] = useState<ProductItem[] | null>([]);
    const [lookup, setLookup] = useState<lookup>({});
    const [type, setType] = useState<Category | 'all'>('all');

    useEffect(() => {
        axios.get<{ product: ProductItem[]; mainproducts: lookup }>('/api/getList?type=' + type).then((data) => {
            let prods = data.data.product ?? [];

            setProdData(prods ?? []);
            setLookup(data.data.mainproducts ?? {});
            console.log(data.data);
        });
    }, [type]);

    return (
        <div className="flex h-[95vh] w-[100vw] flex-col items-center justify-around mt-[2vh]">
            <div className="absolute top-0 left-0 m-2">
                <Link href="/">
                    <Button>
                        <IconArrowBack />
                    </Button>
                </Link>
            </div>
            <Select value={type} data={['all', ...CategoryList]} onChange={(e: any) => setType(e as Category | 'all')} />
            {prodData === null || prodData.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <h1>No items in that category!</h1>
                </div>
            ) : (
                <div className="flex-1 w-full items-center mt-10">
                    {prodData?.map((item: ProductItem) => {
                        const product = lookup[(item as any)._id];

                        if (product == null) return;

                        return (
                            <Paper className="flex flex-row items-center w-[90%] ml-[5%] mb-3" key={item.UUID} radius="md">
                                <div className="w-[100px] mr-3">
                                    <Image src={product.Image} width={400} height={400} alt="food pic" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-red-600 text-sm pt-2">
                                        Purchased from {product.Where} for £{product.Price}
                                    </p>
                                    <h1 className="text-[25px]">{product.Name}</h1>
                                    <div className="flex flex-row mt-0 text-neutral-500  text-sm pb-2">
                                        <p>{item.WeightLeft}g </p>
                                        <p className="pl-2 pr-2"> | </p>
                                        <p> {item.QuantityLeft} items</p>
                                    </div>
                                </div>
                            </Paper>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
