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
  const { departureRequest, tour, status, availableTourId } = body;
  if (
    !departureRequest ||
    !tour ||
    !status ||
    (!availableTourId && availableTourId !== "")
  ) {
    return Response.json({
      status: 400,
      message: "Bad Request",
    });
  }
  const { firstName, lastName } = departureRequest;
  const { title } = tour;
  const info = await transporter.sendMail({
    from: `"TTR Mongolia" <${process.env.CONTACT_EMAIL}>`, // sender address
    // to: "info@ttrmongolia.com", // list of receivers
    to: departureRequest.email,
    subject: `Departure Request Decision`, // Subject line
    text: `
    Dear ${firstName} ${lastName},
    Thank you for your departure request for the ${title}
    ${
      status == "Denied"
        ? "Regrettably, we must inform you that your departure request has been denied. Unfortunately, we were unable to accommodate your requested departure at this time. We apologize for any inconvenience this may cause."
        : "We are pleased to inform you that your departure request has been approved! Your tour is scheduled to depart as requested."
    }
    ${
      status == "Approved" &&
      `Book Now: https://ttr-mongolia.vercel.app/book?availableTourId=${availableTourId}`
    }
    Thank you once again for choosing TTR Mongolia.
    
    Best regards,
    
    Doljinsuren Erdenebat
    Tour Manager
    TTR Mongolia LLC
    Gandirs Tower, Baruun Selbe Street
    Ulaanbaatar, Mongolia
    E: info@ttrmongolia.com
    P: (976) 70141001
    W: ttrmongolia.com
  `, // plain text body
    html: `
        <div>
          <p>
            Dear ${firstName} ${lastName},
            <br/>
            <br/>
            Thank you for your departure request for the ${title}.
            <br/>
            <br/>
            ${
              status == "Denied"
                ? "Regrettably, we must inform you that your departure request has been denied. Unfortunately, we were unable to accommodate your requested departure at this time. We apologize for any inconvenience this may cause."
                : "We are pleased to inform you that your departure request has been approved! Your tour is scheduled to depart as requested."
            }
            ${
              status == "Approved"
                ? `
              <br/>
              You can now book the tour immediately by clicking on the following link
              <br/>
              <a href="https://ttr-mongolia.vercel.app/book?availableTourId=${availableTourId}">https://ttr-mongolia.vercel.app/book?availableTourId=${availableTourId}</a>`
                : ""
            }
            <br/>
            <br/>
            Thank you once again for choosing TTR Mongolia.
            <br/>
            Best regards,
            <br/>
            Doljinsuren Erdenebat
            <br/>
            Tour Manager
            <br/>
            TTR Mongolia LLC
            <br/>
            Gandirs Tower, Baruun Selbe Street
            <br/>
            Ulaanbaatar, Mongolia
            <br/>
            E: info@ttrmongolia.com
            <br/>
            P: (976) 70141001
            <br/>
            W: ttrmongolia.com
          </p>
        </div>
      `,
  });
  return Response.json({
    info,
  });
}
