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
        let Category = {};
        if (req.query.type !== "all") {
            Category = { Category: req.query.type }
        }
        const product = await collection2.find(Category).toArray();

        console.log(Category);
        const productOut = await collection.aggregate<ProductItem>([
            {
                $match: {
                    prodId: { $in: product.map((prod) => prod.prodId) },
                    inStock: true,
                },

            },
            {
                $group: { _id: "$prodId", QuantityLeft: { $sum: "$QuantityLeft" }, WeightLeft: { $sum: "$WeightLeft" } }
            }
        ]).toArray();


        let lookupTabel: any = {};
        product.forEach(e => {
            lookupTabel[e.prodId] = e;
        });
        res.json({ product: productOut, mainproducts: lookupTabel });
    } else {
        res.status(500).json({ error: "no db connection" });
    }

});

export default apiRoute;