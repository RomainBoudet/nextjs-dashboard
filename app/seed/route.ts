import bcrypt from "bcrypt";
import { invoices, customers, revenue, users } from "../lib/placeholder-data";
import pg from "pg";

const { Pool } = pg;
const client = new Pool({});

async function tableUsers() {
  await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);
}

async function tableInvoices() {
  await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

  await client.query(`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `);
}

async function tableCustomers() {
  await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

  await client.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `);
}

async function tableRevenue() {
  await client.query(`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `);
}

//! On seed chaque table aprés la création.

async function seedUsers() {
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await client.query(
      `INSERT INTO users (id, name, email, password)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO NOTHING`,
      [user.id, user.name, user.email, hashedPassword]
    );
  }
};

async function seedCustomers() {
  for (const customer of customers) {
    await client.query(
      `INSERT INTO customers (id, name, email, image_url)
       VALUES ($1, $2, $3, $4)`,
      [customer.id, customer.name, customer.email, customer.image_url]
    );
  }
};

async function seedInvoices() {
  for (const invoice of invoices) {
    await client.query(
      `INSERT INTO invoices (customer_id, amount, status, date)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO NOTHING`,
      [invoice.customer_id, invoice.amount, invoice.status, invoice.date]
    );
  }
};

async function seedRevenue() {
  for (const rev of revenue) {
    await client.query(
      `INSERT INTO revenue (month, revenue)
       VALUES ($1, $2)
       ON CONFLICT (month) DO NOTHING`,
      [rev.month, rev.revenue]
    );
  }
};

export async function GET() {
  try {
    await client.query("BEGIN");

    // Créer et insérer des données dans chaque table
    await tableUsers();
    await tableCustomers();
    await tableInvoices();
    await tableRevenue();

    await seedUsers();
    await seedCustomers();
    await seedInvoices();
    await seedRevenue();

    await client.query("COMMIT");

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Database seeding error:", error);
    await client.query("ROLLBACK");
    return Response.json({ error }, { status: 500 });
  }
};