const crypto = require("crypto");

const [, , ORDER_ID, STATUS_CODE, GROSS] = process.argv;
const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

if (!ORDER_ID || !STATUS_CODE || !GROSS) {
  console.error(
    "Usage: node scripts/computeSig.js <ORDER_ID> <STATUS_CODE> <GROSS_AMOUNT>"
  );
  process.exit(1);
}
if (!SERVER_KEY) {
  console.error("Missing MIDTRANS_SERVER_KEY env");
  process.exit(1);
}

const raw = `${ORDER_ID}${STATUS_CODE}${GROSS}${SERVER_KEY}`;
const sig = crypto.createHash("sha512").update(raw).digest("hex");
console.log(sig);
