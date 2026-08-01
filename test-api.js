fetch("http://localhost:3001/api/leads/external", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "my-super-secret-landing-page-key-123"
  },
  body: JSON.stringify({
    name: "Test Node",
    phoneNumber: "1122334455",
    email: "test@test.com",
    courseName: "BBA"
  })
})
.then(async r => {
  console.log("Status:", r.status);
  const text = await r.text();
  console.log("Response text:", text);
})
.catch(err => console.error(err));
