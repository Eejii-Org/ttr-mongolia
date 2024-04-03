import nodemailer from "nodemailer";
export const dynamic = "force-dynamic"; // defaults to auto

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.CONTACT_EMAIL,
    pass: process.env.CONTACT_PASSWORD,
  },
});

export async function POST(request: Request) {
  const body = await request.json();
  const info = await transporter.sendMail({
    from: `"TTR Mongolia Website Contact" <${process.env.CONTACT_EMAIL}>`, // sender address
    to: "enhuush0704@gmail.com", // list of receivers
    subject: `Contact ${body?.email}`, // Subject line
    text:
      "Name: " +
      body?.firstName +
      " " +
      body?.lastName +
      "\n email: " +
      body?.email +
      "\n phoneNumber:" +
      body?.phoneNumber +
      "\n Description:" +
      body?.description, // plain text body
    html: `
        <div>
          <div>Name: ${body?.firstName} ${body?.lastName}</div>
          <div>Email: ${body?.email}</div>
          <div>PhoneNumber: ${body?.phoneNumber}</div>
          <div>Description: ${body?.description}</div>
        </div>
      `, // html body
  });
  return Response.json(info);
}
// type RequestBodyType = {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   description: string;
// };
