import { db } from "@vercel/postgres";

async function listInvoices() {
  const client = await db.connect();

  try {
    const data = await client.sql`
      SELECT invoices.amount, customers.name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.amount = 666;
    `;
    return data.rows;
  } finally {
    client.release(); // Ensure the client is released to avoid connection leaks.
  }
}

export async function GET() {
  try {
    const invoices = await listInvoices();
    return new Response(JSON.stringify(invoices), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch invoices" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
