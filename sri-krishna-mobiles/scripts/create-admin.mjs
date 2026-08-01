/**
 * Create or promote a Sri Krishna Mobiles admin user in MongoDB.
 *
 * Usage on VPS:
 *   cd /home/dani/sri-krishna-mobiles
 *   node scripts/create-admin.mjs admin@example.com "YourStrongPass1" "Admin Name"
 *
 * Optional 4th arg for role: admin | superadmin (default: admin)
 */

import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Load .env / .env.local if present (no dotenv dependency required)
function loadEnvFile(file) {
  const full = path.join(process.cwd(), file);
  if (!fs.existsSync(full)) return;
  const lines = fs.readFileSync(full, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");
loadEnvFile(".env.production");

async function main() {
  const email = (process.argv[2] || "").toLowerCase().trim();
  const password = process.argv[3] || "";
  const name = process.argv[4] || "Admin";
  const role = (process.argv[5] || "admin").toLowerCase();

  if (!email || !password) {
    console.log(`
Usage:
  node scripts/create-admin.mjs <email> <password> [name] [role]

Examples:
  node scripts/create-admin.mjs admin@krishna.store StrongPass123 "Shop Admin"
  node scripts/create-admin.mjs owner@krishna.store StrongPass123 "Owner" superadmin
`);
    process.exit(1);
  }

  if (!["admin", "superadmin", "staff", "cashier"].includes(role)) {
    console.error("Invalid role. Use: admin | superadmin | staff | cashier");
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is missing. Set it in .env on the VPS.");
    process.exit(1);
  }

  await mongoose.connect(uri);

  const User =
    mongoose.models.User ||
    mongoose.model(
      "User",
      new mongoose.Schema(
        {
          email: { type: String, required: true, unique: true, lowercase: true },
          name: { type: String, required: true },
          password: { type: String },
          role: { type: String, default: "customer" },
          isActive: { type: Boolean, default: true },
          isBlocked: { type: Boolean, default: false },
          addresses: { type: Array, default: [] },
          wishlist: { type: Array, default: [] },
        },
        { timestamps: true }
      )
    );

  const hash = await bcrypt.hash(password, 12);
  const existing = await User.findOne({ email });

  if (existing) {
    existing.password = hash;
    existing.role = role;
    existing.name = name;
    existing.isActive = true;
    existing.isBlocked = false;
    await existing.save();
    console.log(`Updated existing user to ${role}: ${email}`);
  } else {
    await User.create({
      email,
      name,
      password: hash,
      role,
      isActive: true,
      isBlocked: false,
    });
    console.log(`Created ${role} user: ${email}`);
  }

  await mongoose.disconnect();
  console.log("Done. Log in at /auth/login then open /admin");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
