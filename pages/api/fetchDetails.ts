import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import clientPromise from "../../server/MongoConnect";


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
        const collection = db.db("InventoryManager").collection("purchases");
        const product = await collection.aggregate([
            {
                $match: {
                    prodId: id,
                },
            },
            {
                $group: { _id: "$prodId", QuantityLeft: { $sum: "$QuantityLeft" }, WeightLeft: { $sum: "$WeightLeft" } }
            }

        ]).toArray()
        res.json({ product });
    } else {
        res.status(500).json({ error: "no db connection" });
    }

});

export default apiRoute;