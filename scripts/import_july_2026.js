const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const uri = 'mongodb+srv://bditacademic:bditacademic@bdit-academics.7ipewiv.mongodb.net/bditacademic-CRM?retryWrites=true&w=majority';

async function main() {
  const jsonPath = path.join(__dirname, 'july_2026_data.json');
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const students = JSON.parse(rawData);

  console.log(`Loaded ${students.length} students from ${jsonPath}`);

  await mongoose.connect(uri);
  console.log('Connected to MongoDB Atlas.');

  const collection = mongoose.connection.db.collection('students');

  let insertedCount = 0;
  let skippedCount = 0;

  for (const stu of students) {
    // Convert string ISO dates to real BSON Dates
    stu.createdAt = new Date(stu.createdAt);
    stu.updatedAt = new Date(stu.updatedAt);
    if (stu.admissionRemarkUpdatedAt) {
      stu.admissionRemarkUpdatedAt = new Date(stu.admissionRemarkUpdatedAt);
    }
    if (Array.isArray(stu.payments)) {
      stu.payments = stu.payments.map((p) => ({
        ...p,
        date: new Date(p.date),
      }));
    }

    // Check if duplicate phone number already exists
    const existing = await collection.findOne({ phoneNumber: stu.phoneNumber });
    if (existing) {
      console.log(`Skipping (already exists): ${stu.name} (${stu.phoneNumber})`);
      skippedCount++;
    } else {
      const res = await collection.insertOne(stu);
      console.log(`Inserted: ${stu.name} -> ID: ${res.insertedId}`);
      insertedCount++;
    }
  }

  const totalInDb = await collection.countDocuments();
  console.log('-------------------------------------------');
  console.log(`Successfully processed July 2026 records:`);
  console.log(`Inserted: ${insertedCount}`);
  console.log(`Skipped: ${skippedCount}`);
  console.log(`Total students now in MongoDB: ${totalInDb}`);

  process.exit(0);
}

main().catch((err) => {
  console.error('Import Error:', err);
  process.exit(1);
});
