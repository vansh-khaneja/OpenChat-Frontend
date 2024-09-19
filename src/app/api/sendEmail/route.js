import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const {  email,apiKey } = await request.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "powrsofficial@gmail.com",
        pass: "mrnb eptw copm wuce", 
      },
    });

    const mailOption = {
      from: "powrsofficial@gmail.com",
      to: "shubhamera484@gmail.com",
      to:email,
      subject: "New Contact Form Submission",
      html: `
       <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Welcome to OPENCHAT, !</h2>
        <p>Thank you for reaching out to us. Below is the information you submitted:</p>
        <ul>
          <li><strong>API KEY:</strong> ${apiKey}</li>
         
        </ul>
        <p>We are excited to have you on board! Feel free to reach out to us anytime using the open chat link below:</p>
        <p><a href="https://powrsopenchat.com" target="_blank" style="color: #4CAF50;">Join our open chat</a></p>
        <p>Best regards,</p>
        <p>The POWRS Team</p>
      </div>
  
      `,
    };

    await transporter.sendMail(mailOption);

    return new Response(
      JSON.stringify({ message: "Email Sent Successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          Location: "/success",
        },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ message: "Failed to Send Email" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}