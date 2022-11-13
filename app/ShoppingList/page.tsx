'use client';

import { Button } from '@mantine/core';
import { IconArrowBack } from '@tabler/icons';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Product } from '../../types/productTypes';
import MainTable from './table';

interface ShoppingList {
    listWhere: {
        [key: string]: Product[];
    };
}

export default function Shopping() {
    const [ShoppingList, setShoppingList] = useState<ShoppingList | null>(null);
    const [show, setShow] = useState(false);
    const [total, setTotal] = useState<number | null>(null);

    useEffect(() => {
        axios.get('/api/shoppingList').then((res) => {
            setShoppingList(res.data);
            if (Object.keys(res.data.listWhere).length === 0) {
                setShow(true);
            } else {
                console.log(Object.entries((res.data as ShoppingList).listWhere));
                let newtotal = 0;
                Object.entries((res.data as ShoppingList).listWhere).forEach(([key, value]) => {
                    value.forEach((item) => {
                        newtotal += item.Price;
                    });
                });
                setTotal(newtotal);
            }
        });
    }, []);

    return (
        <div className="flex h-[95vh] w-[100vw] flex-col items-center justify-around mt-[2vh]">
            <div className="absolute top-0 left-0 m-2">
                <Link href="/">
                    <Button>
                        <IconArrowBack />
                    </Button>
                </Link>
            </div>
            <h1>Shopping List {total !== null && `£${total}`}</h1>

            <div style={{ flexGrow: 1 }} className="w-[100vw] flex items-center flex-col mt-6">
                {show && <h1>Nothing to buy :)</h1>}
                {Object.entries(ShoppingList?.listWhere ?? {}).map(([e, k]) => {
                    return (
                        <div className="w-[80%] mb-8">
                            <h1>{e}</h1>
                            <MainTable elements={k} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
