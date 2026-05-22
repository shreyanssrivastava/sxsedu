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
    const { email } = JSON.parse(req.body);

    const link = await admin.auth().generateEmailVerificationLink(email);

/*
    await emailjs.send('service_mscgy1w', 'template_93hkrns',
      {
        userEmail: email,
        verifyLink: link,
      },
      {
        publicKey: process.env.EMAILJS_PBL_KEY_SS3,
        privateKey: process.env.EMAILJS_PRV_KEY_SS3,
      }
    );
*/   
    
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: 'service_mscgy1w',
        template_id: 'template_93hkrns',
        user_id: process.env.EMAILJS_PBL_KEY_SS3,
        accessToken: process.env.EMAILJS_PRV_KEY_SS3,
        template_params: {
          userEmail: email,
          verifyLink: link,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Email sending failed!");
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

