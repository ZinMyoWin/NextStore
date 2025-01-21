import { NextRequest } from "next/server";
import { connectToDB } from "../../db";
import { ObjectId } from "mongodb";

type Params = {
  id: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    // Connect to the database
    const { db } = await connectToDB();

    // Extract the `id` from the request parameters like params.id
    const { id } = await params;

    // Query the database to find the product by `id`
    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    // If no product is found, return a 404 response
    if (!product) {
      return new Response("Product not found", {
        status: 404,
      });
    }

    // Return the found product as JSON
    return new Response(JSON.stringify(product), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);

    // Return a 500 response for any server errors
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    // get the database connection
    const { db } = await connectToDB();

    const { id } = await params;

    const remainingProducts = db
      .collection("products")
      .findOneAndDelete({ _id: new ObjectId(id) });

    if (!remainingProducts) {
      return new Response(
        JSON.stringify({ message: "No Products To Delete. " }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("Remaining product: ", remainingProducts)

    return new Response(JSON.stringify(remainingProducts), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);

    // Return a 500 response for any server errors
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: Params }
// ) {
//   try {
//     // get the database connection
//     const { db } = await connectToDB();
//     const {name, shortDescription, price, imageUrl} = await request.json()



//     const { id } = await params;

//     const remainingProducts = db
//       .collection("products")
//       .findOneAndUpdate({ _id: new ObjectId(id) } , {});

//     if (!remainingProducts) {
//       return new Response(
//         JSON.stringify({ message: "No Products To Delete. " }),
//         {
//           status: 404,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//     }

//     return new Response(JSON.stringify(remainingProducts), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching product:", error);

//     // Return a 500 response for any server errors
//     return new Response("Internal Server Error", {
//       status: 500,
//     });
//   }
// }
