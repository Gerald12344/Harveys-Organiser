import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import clientPromise from "../../server/MongoConnect";
import { ProductItem } from "../../types/productTypes";


const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
        res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});


apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {


    const db = await clientPromise;
    if (db) {
        const collection = db.db("InventoryManager").collection("purchases");
        const collection2 = db.db("InventoryManager").collection("products");
        const product = await collection.find({ BestbeforeDate: { $lt: new Date().valueOf() + 7 * 24 * 60 * 60 * 1000 } }).toArray() as any as ProductItem[];
        const mainproducts = await collection2.find({ prodId: { $in: product.map(e => e.prodId) } }).toArray();

        let lookupTabel: any = {};
        mainproducts.forEach(e => {
            lookupTabel[e.prodId] = e;
        });
        res.json({ product, mainproducts: lookupTabel });
    } else {
        res.status(500).json({ error: "no db connection" });
    }

});

export default apiRoute;