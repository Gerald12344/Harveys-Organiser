// Base ADT
export interface Product {
    prodId: string;
    Name: string;
    Price: number;
    Weight: number;
    Quantity: number;
    CuboardEssntial: boolean;
    Category: Category;
    Image: string;
    Where: Where
}

// Individual Purchase 
export interface ProductItem {
    _id?: string;
    prodId: string;
    UUID: string;
    BestbeforeDate: number;
    PurchaseDate: number;
    QuantityLeft: number;
    WeightLeft: number;
    inStock: boolean;
}

export type Category = "Meat" | "Dairy" | "Fruit" | "Vegetable" | "Carbs" | "Snacks" | "Drinks" | "Baking" | "Other"
export type Where = "Aldi" | "Spar" | "Tesco" | "Cost Cutter" | "Lidl" | "Sainsburys" | "Asda" | "Morrisons" | "Waitrose" | "Coop" | "M&S" | "Other"

const CategoryList = ["Meat", "Dairy", "Fruit", "Vegetable", "Carbs", "Snacks", "Drinks", "Baking", "Other"];
const WhereList: Where[] = ["Aldi", "Spar", "Tesco", "Cost Cutter", "Lidl", "Sainsburys", "Asda", "Morrisons", "Waitrose", "Coop", "M&S", "Other"];
export { CategoryList, WhereList };