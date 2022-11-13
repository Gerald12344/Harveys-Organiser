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


apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const db = await clientPromise;
    if (db) {
        const collection = db.db("InventoryManager").collection("products");
        const collection2 = db.db("InventoryManager").collection("purchases");
        const RequiredProducts = await collection.find<Product>({ CuboardEssntial: true }).toArray();
        let objectReq: any = {};
        RequiredProducts.forEach((product) => {
            objectReq[product.prodId] = product;
        });

        const product = await collection2.aggregate<ProductItem>([
            {
                $match: {
                    prodId: { $in: RequiredProducts.map((prod) => prod.prodId) },
                },

            },
            {
                $group: { _id: "$prodId", QuantityLeft: { $sum: "$QuantityLeft" }, WeightLeft: { $sum: "$WeightLeft" } }
            }
        ]).toArray();

        let listWhere: any = {};



        product.forEach((prod) => {
            let item = objectReq[prod._id ?? ""];
            if (item === undefined) return;
            if (prod.QuantityLeft < (item.Quantity ?? 0 / 2)) {
                if (listWhere[item.Where] === undefined) {
                    listWhere[item.Where] = [item]
                } else {
                    listWhere[item.Where].push(item);
                }
                return
            }

            if (prod.WeightLeft < (item.Weight ?? 0 / 2)) {
                if (listWhere[item.Where] === undefined) {
                    listWhere[item.Where] = [item]
                } else {
                    listWhere[item.Where].push(item);
                }
                return
            }
        });


        res.json({ listWhere });
    } else {
        res.status(500).json({ error: "no db connection" });
    }

});

export default apiRoute;