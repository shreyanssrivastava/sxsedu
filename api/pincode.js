export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
  
    const { code } = JSON.parse(req.body);
 
    const response = await fetch(`https://api.postalpincode.in/pincode/${code}`);
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error("API Error: " + response.status);
    }
    
    if (data[0].Status === "Success") {
      const result = data[0].PostOffice[0];
      res.status(200).json({ city: result.District, state: result.State });
    } else {
        res.status(404).json({ error: "Invalid Pincode!" });
    }

  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}