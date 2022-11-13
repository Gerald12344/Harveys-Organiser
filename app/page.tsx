'use client';
import { Button } from '@mantine/core';

export default function mainApp() {
    return (
        <div className="w-[100vw] h-[100vh] flex items-center justify-center flex-col">
            <h1 className="text-[30px] text-center">Harveys Inventory Manager</h1>
            <p className="text-neutral-400 pb-1">Harveys thing for idk organizing and shit</p>
            <div className="flex justify-around w-[80%] flex-col items-center ">
                <a href={'/add'} className="p-3">
                    <Button>Add items</Button>
                </a>
                <a href={'/remove'} className="p-3">
                    <Button style={{ backgroundColor: '#E03131' }} className="Nope">
                        Remove items
                    </Button>
                </a>
                <a href={'/SoonExpire'} className="p-3">
                    <Button style={{ backgroundColor: '#40C057' }} className="Nope">
                        Soon Expiring Items
                    </Button>
                </a>
                <a href={'/search'} className="p-3">
                    <Button style={{ backgroundColor: '#1098AD' }} className="Nope">
                        Search Items
                    </Button>
                </a>
            </div>
        </div>
    );
}
