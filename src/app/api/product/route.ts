import { connectToDB } from "../db"

const {db} = await connectToDB();

export async function GET(){

    const products = await db.collection('products').find({}).toArray();


    return new Response(JSON.stringify(products),{
        status:200,
        headers:{
            'Content-Type':'application/json'
        }
    })
}