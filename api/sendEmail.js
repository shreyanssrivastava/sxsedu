import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type"); 
  
  try {
  
    const { email, action } = JSON.parse(req.body);
    
    await admin.auth().getUserByEmail(email);
    
    let tempId;
    let link;
    
    if (action === 'verify') {
        tempId = process.env.EMAILJS_TL_ID + "2";
        link = await admin.auth().generateEmailVerificationLink(email);
    } else if (action === 'reset') {
        tempId = process.env.EMAILJS_TL_ID + "1";
        link = await admin.auth().generatePasswordResetLink(email);
    }
   
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: tempId,
        user_id: process.env.EMAILJS_PBL_KEY_SS3,
        accessToken: process.env.EMAILJS_PRV_KEY_SS3,
        template_params: {
          userEmail: email,
          actionLink: link,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Email sending failed!");
    }

    res.status(200).json({ success: true });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}