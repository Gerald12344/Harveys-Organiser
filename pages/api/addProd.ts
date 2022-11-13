import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import clientPromise from "../../server/MongoConnect";
import { Product, ProductItem } from "../../types/productTypes";


const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});


apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
    let { BestbeforeDate, PurchaseDate, QuantityLeft, UUID, WeightLeft, prodId, inStock }: ProductItem = req.body;

    const db = await clientPromise;
    if (db) {
        const collection = db.db("InventoryManager").collection("purchases");
        const product = await collection.insertOne({ BestbeforeDate, PurchaseDate, QuantityLeft, UUID, WeightLeft, prodId, inStock });
        res.json({ success: true });
    } else {
        res.status(500).json({ error: "no db connection" });
    }

});

export default apiRoute;