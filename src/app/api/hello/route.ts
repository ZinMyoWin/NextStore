export async function GET() {
    return new Response(JSON.stringify({message: "Hello from NextJs App"}), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
        },
    })
}