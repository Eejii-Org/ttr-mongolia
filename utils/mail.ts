import { convert } from "html-to-text";
import { CustomTransactionType, TransactionType } from "./types";

const options = {
  wordwrap: 130,
};
export type templateTypeType =
  | "requestApprove"
  | "requestDeny"
  | "requestReply"
  | "requestRentcarApprove"
  | "requestRentcarDeny"
  | "requestCarRentalReply"
  | "requestAdmin"
  | "requestCarRentalAdmin"
  | "bookSuccess"
  | "bookFail"
  | "adminPaymentSuccess"
  | "adminPaymentFailure"
  | "contact"
  | "contactAdmin"
  | "privateTour"
  | "adminPrivateTour"
  | "bookInvoice"
  | "adminBookInvoice"
  | "customPayReceipt"
  | "bookSuccessReceipt";
export type templateKeysType =
  | "requestApprove"
  | "requestDeny"
  | "requestReply"
  | "requestRentcarApprove"
  | "requestRentcarDeny"
  | "requestCarRentalReply"
  | "requestAdmin"
  | "requestCarRentalAdmin"
  | "bookSuccess"
  | "bookFail"
  | "adminPaymentSuccess"
  | "adminPaymentFailure"
  | "contact"
  | "contactAdmin"
  | "privateTour"
  | "adminPrivateTour"
  | "bookInvoice"
  | "adminBookInvoice";
// bookSuccessReceipt bhgu cus it's not used for other emails
export type detailType = {
  name?: string;
  bookURL?: string;
  paymentURL?: string;
  rentalcarURL?: string;
  adminNote?: string;
  tourDetail?: {
    title: string;
    date: string;
    duration: number;
    peopleCount: number;
    paidAmount: number;
  };
  userDetail?: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    nationality: string;
    dateOfBirth: string;
    description: string;
  };
  departureDetail?: {
    tourId: number;
    startingDate: string;
    tourTitle: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    nationality: string;
    dateOfBirth: string;
    peopleCount: number;
    additionalInformation: string;
  };
  paymentDetail?: {
    title: string;
    startingDate: string;
    amount: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    nationality: string;
    dateOfBirth: string;
    peopleCount: number;
    additionalInformation: string;
  };
  carRentalDetail?: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    age: string;
    internationalDriverLicence: string;
    startDate: string;
    endDate: string;
    rentalCarName: string;
    withDriver: string;
    price: number;
  };
  privateTourDetail?: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    nationality: string;
    dateOfBirth: string;
    peopleCount: number;
    additionalInformation: string;
    destination: string;
    accomodationPreference: string;
    budgetConsiderations: string;
    additionalRequests: string;
    startingDate: string;
  };
  bookingDetail?: {
    personalDetail: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
      email: string;
      nationality: string;
      dateOfBirth: string;
      peopleCount: number;
      additionalInformation: string;
    };
    paymentType: string;
    paymentMethod: string;
    availableTourId: number;
    tourTitle: string;
    startingDate: string;
    deposit: string;
    pax: number;
    total: number;
  };
  transactionDetail?: TransactionType;
};
// subject: string, body1: string, body2?: string
export const mailTemplate = (
  templateType: templateTypeType,
  detail: detailType
) => {
  const {
    name,
    bookURL,
    paymentURL,
    rentalcarURL,
    tourDetail,
    userDetail,
    departureDetail,
    paymentDetail,
    adminNote,
    privateTourDetail,
    bookingDetail,
    transactionDetail,
    carRentalDetail
  } = detail;

  if (templateType == "customPayReceipt") {
    if (transactionDetail) {
      const html = receiptEmailGet(
        "Custom Payment",
        "custom",
        transactionDetail
      );
      return {
        subject: "TTR Mongolia Receipt",
        text: convert(html, options),
        html: html,
      };
    }
    return {
      subject: "TTR Mongolia Receipt",
      text: "",
      html: "",
    };
  }
  if (templateType == "bookSuccessReceipt") {
    if (transactionDetail) {
      const html = receiptEmailGet(
        tourDetail?.title || "Payment",
        "book",
        transactionDetail
      );
      return {
        subject: "TTR Mongolia Receipt",
        text: convert(html, options),
        html: html,
      };
    }
    return {
      subject: "TTR Mongolia Receipt",
      text: "",
      html: "",
    };
  }

  const emailDetails: {
    [K in templateKeysType]: {
      header: string;
      top: string[];
      link?: {
        text: string;
        url?: string;
      };
      bottom: string[];
    };
  } = {
    requestApprove: {
      header: `Departure Request Approved! <br/> Book Your Tour Now 🎉`,
      top: [
        `Dear ${name},`,
        `We are thrilled to inform you that your departure request has been approved! Your desired date has been successfully added to our departure schedule.`,
        `Admin's Note: ${adminNote}`,
        `To secure your spot and confirm your booking, simply click on the button below and folow the online booking procedure:`,
      ],
      link: {
        text: "Book Now",
        url: bookURL,
      },
      bottom: [
        `If you have any questions or require further assitance, pleace feel free to contact our customer support team at info@ttrmongolia.com or +976 7014-1001.`,
        `We look forward to welcoming you on this unforgettable adventure !`,
      ],
    },
    requestDeny: {
      header: `Departure Request Denied!`,
      top: [
        `Dear ${name},`,
        `Regrettably, we must inform you that your departure request has been denied. Unfortunately, we were unable to accommodate your requested departure at this time. We apologize for any inconvenience this may cause.`,
        `Admin's Note: ${adminNote}`,
      ],
      bottom: [
        `If you have any questions or require further assitance, pleace feel free to contact our customer support team at info@ttrmongolia.com or +976 7014-1001.`,
      ],
    },
    requestReply: {
      header: `You are now one step closer 🎉`,
      top: [
        `Dear ${name},`,
        `Thank you for requesting a new tour departure.`,
        `We have received your message and want to assure you that our team is already working diligently to process it.`,
      ],
      bottom: [
        `Please be patient as we review your request. We will get back to you promptly with confirmation or any alternative options that may be available.`,
        `If you have any questions or require further assitance, pleace feel free to contact our customer support team at info@ttrmongolia.com or +976 7014-1001.`,
        `Thank you for choosing us for your travel needs. We look forward to welcoming you on this unforgettable adventure !`,
      ],
    },
    requestCarRentalReply: {
      header: `You are now one step closer 🎉`,
      top: [
        `Dear ${name},`,
        `Thank you for requesting a car rental.`,
        `We have received your message and want to assure you that our team is already working diligently to process it.`,
      ],
      bottom: [
        `Please be patient as we review your request. We will get back to you promptly with confirmation or any alternative options that may be available.`,
        `If you have any questions or require further assitance, pleace feel free to contact our customer support team at info@ttrmongolia.com or +976 7014-1001.`,
        `Thank you for choosing us for your travel needs. We look forward to welcoming you on this unforgettable adventure !`,
      ],
    },
    requestRentcarApprove: {
      header: `Car Rental Request Approved ! Rent Your Car Now 🎉`,
      top: [
        `Dear ${name},`,
        `We are thrilled to inform you that your car rental request has been approved! Our team will send you soon an email with all necessary information for the renting procedure.`,
        `Admin's Note: To secure your car and confirm your renting, simply follow the instructions that will follow.`,
      ],
      bottom: [
        `If you have any questions or require further assitance, pleace feel free to contact our customer support team at info@ttrmongolia.com or +976 7014-1001.`,
        `We look forward to welcoming you on this unforgettable adventure!`,
      ],
    },
    requestRentcarDeny: {
      header: `Rent Car Request Denied!`,
      top: [
        `Dear ${name},`,
        `Regrettably, we must inform you that your car rental request has been denied. Unfortunately, we were unable to accommodate your request at this time. We apologize for any inconvenience this may cause.`,
        `Admin's Note:`
      ],
      bottom: [
        `If you have any questions or require further assitance, pleace feel free to contact our customer support team at info@ttrmongolia.com or +976 7014-1001.`,
      ],
    },
    requestAdmin: {
      header: `[Action Required] New Departure Request from ${departureDetail?.email}`,
      top: [
        `Tour: ${departureDetail?.tourTitle}`,
        `StartingDate: ${departureDetail?.startingDate}`,
        ``,
        `Name: ${departureDetail?.firstName + " " + departureDetail?.lastName}`,
        `Phone: ${departureDetail?.phoneNumber}`,
        `Email: ${departureDetail?.email}`,
        `Nationality: ${departureDetail?.nationality}`,
        `DateOfBirth: ${departureDetail?.dateOfBirth}`,
        `PeopleCount: ${departureDetail?.peopleCount}`,
        `AdditionalInformation: ${departureDetail?.additionalInformation}`,
      ],
      bottom: [],
    },
    requestCarRentalAdmin: {
      header: `[Action Required] New Car Rental Request from ${carRentalDetail?.email}`,
      top: [
        `Vehicle: ${carRentalDetail?.rentalCarName}`,
        `StartDate: ${carRentalDetail?.startDate}`,
        `EndDate: ${carRentalDetail?.endDate}`,
        ``,
        `Name: ${carRentalDetail?.firstName + " " + carRentalDetail?.lastName}`,
        `Phone: ${carRentalDetail?.phoneNumber}`,
        `Email: ${carRentalDetail?.email}`,
        `Age: ${carRentalDetail?.age}`,
        `WithDriver: ${carRentalDetail?.withDriver == "1" ? 'YES' : 'NO'}`,
        `Price: ${carRentalDetail?.price}`,
        `InternationalDriverLicence: ${carRentalDetail?.internationalDriverLicence == "1" ? 'YES' : 'NO'}`,
      ],
      bottom: [],
    },
    bookSuccess: {
      header: `You have successfully booked a tour 🎉`,
      top: [
        `Dear ${name},`,
        `We are delighted to inform you that your tour booking has been successfully confirmed!`,
        `Your reservation details are as follows:
        <ul>
          <li class="body-text">
            Tour Name: ${tourDetail?.title}
          </li>
          <li class="body-text">
            Dates: ${getDate(tourDetail?.date, tourDetail?.duration)}
          </li>
          <li class="body-text">
            Number of Travelers: ${tourDetail?.peopleCount}
          </li>
          <li class="body-text">
           Total Amount Paid: ${tourDetail?.paidAmount}
          </li>
        </ul>`,
      ],
      bottom: [
        `Thank you for booking with us, we are thrilled that you have chosen to embark on an adventure with us. We are committed to providing you with an unforgettable experience.`,
        `In preparation for your tour, please keep an eye on your inbox for any updates or additional information regarding your booking.`,
        `If you have any questions or require further assitance, pleace feel free to contact our customer support team at info@ttrmongolia.com or +976 7014-1001.`,
        `Thank you for choosing us for your travel needs. We look forward to welcoming you on this unforgettable adventure !`,
      ],
    },
    bookFail: {
      header: `Payment Failure: Tour Booking`,
      top: [
        `Dear ${name},`,
        `We regret to inform you that there was an issue processing the payment for your tour booking. Unfortunately, the payment transaction was not successful.`,
        `To proceed with your tour booking, we kindly request that you review the payment information provided and ensure that all details are correct. If necessary, please consider using an alternative payment method.`,
        `Once you have verified your payment information, please attempt to book again by clicking the button below:`,
      ],
      link: {
        text: "Book a Tour",
        url: paymentURL,
      },
      bottom: [
        `If you have any questions or require further assitance, pleace feel free to contact our customer support team at info@ttrmongolia.com or +976 7014-1001.`,
        `We look forward to welcoming you on this unforgettable adventure !`,
      ],
    },
    bookInvoice: {
      header: `You are now one step closer 🎉`,
      top: [
        `Dear ${
          bookingDetail?.personalDetail.firstName +
          " " +
          bookingDetail?.personalDetail.lastName
        },`,
        `Thank you for booking a tour departure.`,
        `We have received your booking and want to assure you that our team is already working diligently to process it.`,
      ],
      bottom: [
        `Please be patient as we prepare and send invoice.`,
        `If you have any questions or require further assitance, pleace feel free to contact our customer support team at info@ttrmongolia.com or +976 7014-1001.`,
        `Thank you for choosing us for your travel needs. We look forward to welcoming you on this unforgettable adventure !`,
      ],
    },
    adminBookInvoice: {
      header: `[Action Required] Booking Invoice`,
      top: [
        `Name: ${
          bookingDetail?.personalDetail.firstName +
          " " +
          bookingDetail?.personalDetail.lastName
        }`,
        `Phone: ${bookingDetail?.personalDetail.phoneNumber}`,
        `Email: ${bookingDetail?.personalDetail.email}`,
        `Nationality: ${bookingDetail?.personalDetail.nationality}`,
        `DateOfBirth: ${bookingDetail?.personalDetail.dateOfBirth}`,
        `PeopleCount: ${bookingDetail?.personalDetail.peopleCount}`,
        `AdditionalInformation: ${bookingDetail?.personalDetail.additionalInformation}`,
        `TourStartingDate: ${bookingDetail?.startingDate}`,
        `Destination: ${bookingDetail?.tourTitle}`,
        `Pax: ${bookingDetail?.pax}`,
        `Deposit: ${bookingDetail?.deposit}`,
        `Total: ${bookingDetail?.total}`,
      ],
      bottom: [],
    },
    adminPaymentSuccess: {
      header: `Payment Success ${paymentDetail?.email}`,
      top: [
        `Tour: ${paymentDetail?.title}`,
        `StartingDate: ${paymentDetail?.startingDate}`,
        `Amount: ${paymentDetail?.amount}`,
        ``,
        `Name: ${paymentDetail?.firstName + " " + paymentDetail?.lastName}`,
        `Phone: ${paymentDetail?.phoneNumber}`,
        `Email: ${paymentDetail?.email}`,
        `Nationality: ${paymentDetail?.nationality}`,
        `DateOfBirth: ${paymentDetail?.dateOfBirth}`,
        `PeopleCount: ${paymentDetail?.peopleCount}`,
        `AdditionalInformation: ${paymentDetail?.additionalInformation}`,
      ],
      bottom: [],
    },
    adminPaymentFailure: {
      header: `[Action Required] Payment Failure ${paymentDetail?.email}`,
      top: [
        `Tour: ${paymentDetail?.title}`,
        `StartingDate: ${paymentDetail?.startingDate}`,
        `Amount: ${paymentDetail?.amount}`,
        ``,
        `Name: ${paymentDetail?.firstName + " " + paymentDetail?.lastName}`,
        `Phone: ${paymentDetail?.phoneNumber}`,
        `Email: ${paymentDetail?.email}`,
        `Nationality: ${paymentDetail?.nationality}`,
        `DateOfBirth: ${paymentDetail?.dateOfBirth}`,
        `PeopleCount: ${paymentDetail?.peopleCount}`,
        `AdditionalInformation: ${paymentDetail?.additionalInformation}`,
      ],
      bottom: [],
    },
    contact: {
      header: `Thank You For Reaching Out To Us`,
      top: [
        `Dear ${name},`,
        `Thank you for reaching out to us.`,
        `We have received your message and our team will get back to you promptly.`,
      ],
      bottom: [
        `Thank you for choosing us for your travel needs. We look forward to welcoming you on this unforgettable adventure !`,
      ],
    },
    contactAdmin: {
      header: `[Action Required] New Inquiry from ${userDetail?.email}`,
      top: [
        `Name: ${userDetail?.firstName + " " + userDetail?.lastName}`,
        `Phone: ${userDetail?.phoneNumber}`,
        `Email: ${userDetail?.email}`,
        `Nationality: ${userDetail?.nationality}`,
        `DateOfBirth: ${userDetail?.dateOfBirth}`,
        `Message: ${userDetail?.description}`,
      ],
      bottom: [],
    },
    privateTour: {
      header: `Thank You For Reaching Out To Us`,
      top: [
        `Dear ${name},`,
        `Thank you for requesting a private tour.`,
        `We have received your message, and our team will start working on it. We will get back to you promptly with a personalized itinerary as you requested or any alternative options that may be available.`,
      ],
      bottom: [
        `If you have any questions or require further assitance, please feel free to contact our customer support team at info@ttrmongolia.com or +976 7014-1001`,
        `Thank you for choosing us for your travel needs. We look forward to welcoming you on this unforgettable adventure !`,
      ],
    },
    adminPrivateTour: {
      header: `[Action Required] New Private Tour Request from ${privateTourDetail?.email}`,
      top: [
        `Name: ${
          privateTourDetail?.firstName + " " + privateTourDetail?.lastName
        }`,
        `Phone: ${privateTourDetail?.phoneNumber}`,
        `Email: ${privateTourDetail?.email}`,
        `Nationality: ${privateTourDetail?.nationality}`,
        `DateOfBirth: ${privateTourDetail?.dateOfBirth}`,
        `PeopleCount: ${privateTourDetail?.peopleCount}`,
        `AdditionalInformation: ${privateTourDetail?.additionalInformation}`,
        `TourStartingDate: ${privateTourDetail?.startingDate}`,
        `Destination: ${privateTourDetail?.destination}`,
        `AccomodationPreference: ${privateTourDetail?.accomodationPreference}`,
        `BudgetConsiderations: ${privateTourDetail?.budgetConsiderations}`,
        `AdditionalRequests: ${privateTourDetail?.additionalRequests}`,
      ],
      bottom: [],
    },
  };
  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap"
        rel="stylesheet"
      />
      <style>
        body {
          width: 100vw;
          font-family: "Nunito Sans", sans-serif;
        }
  
        .container {
          width: 520px;
          margin: 0px auto;
          padding: 48px 20px;
        }
        .title {
          font-weight: 600;
          font-size: 22px;
          margin: 0;
        }
        .body-text {
          font-size: 15px;
          color: rgba(30, 30, 30, 0.8);
        }
        .footer-text {
          font-size: 12px;
          color: rgba(30, 30, 30, 0.5);
          text-align: center;
        }
        .button {
          padding: 8px 32px;
          font-size: 14px;
          font-weight: 500;
          background-color: #fda403;
          border: 0;
          border-radius: 4px;
          text-decoration: none;
          color: black !important;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <table class="container">
        <thead>
          <tr>
            <th style="display: flex; padding-bottom: 24px">
              <img
                width="204.31px"
                height="42px"
                src="https://www.ttrmongolia.com/static/ttr-row.png"
                alt="TTRMongolia"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <h1 class="title">
                ${emailDetails[templateType].header}
              </h1>
            </td>
          </tr>
          <tr>
            <td>
              ${emailDetails[templateType].top
                .map((text) => `<p class="body-text">${text}</p>`)
                .join("")}
              ${
                emailDetails[templateType].link
                  ? `<a class="button" href="${emailDetails[templateType].link?.url}">${emailDetails[templateType].link?.text}</a>`
                  : ``
              }
              ${emailDetails[templateType].bottom
                .map((text) => `<p class="body-text">${text}</p>`)
                .join("")}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>
              <p class="footer-text">
                TTR Mongolia LLC, 1st Floor, 34th Apartment, Chingeltei District,
                Ulaanbaatar, MN
              </p>
            </td>
          </tr>
        </tfoot>
      </table>
    </body>
  </html>
  `;
  return {
    subject: convert(emailDetails[templateType].header),
    text: convert(html, options),
    html: html,
  };
};
const getDate = (date?: string, days?: number) => {
  if (!date || !days) return "";
  const startingDate = new Date(date);
  let endingDate = new Date(date);
  endingDate.setDate(startingDate.getDate() + days - 1);
  return (
    startingDate.toLocaleString("default", { month: "long" }) +
    " " +
    startingDate.getDate() +
    " " +
    startingDate.getFullYear() +
    " - " +
    endingDate.toLocaleString("default", { month: "long" }) +
    " " +
    endingDate.getDate() +
    " " +
    endingDate.getFullYear()
  );
};

const receiptEmailGet = (
  title: string,
  receiptType: "custom" | "book",
  transaction: TransactionType | CustomTransactionType
) => {
  if (receiptType == "custom") {
    const { firstName, lastName, transactionId, created_at, amount } =
      transaction as CustomTransactionType;
    const receipt = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap"
      rel="stylesheet"
    />
    <style>
      body {
        width: 100vw;
        font-family: "Nunito Sans", sans-serif;
      }

      .container {
        width: 520px;
        margin: 0px auto;
        padding: 48px 20px;
      }
      .title {
        font-weight: 600;
        font-size: 26px;
        font-weight: 700;
        margin: 0;
        color: rgba(30, 30, 30, 0.8);
        text-align: center;
      }
      .body-text {
        font-size: 15px;
        color: rgba(30, 30, 30, 0.8);
      }
      .footer-text {
        font-size: 12px;
        color: rgba(30, 30, 30, 0.5);
        text-align: center;
      }
      .button {
        padding: 8px 32px;
        font-size: 14px;
        font-weight: 500;
        background-color: #fda403;
        border: 0;
        border-radius: 4px;
        text-decoration: none;
        color: black !important;
        cursor: pointer;
      }
      .text-center {
        text-align: center;
      }
    </style>
  </head>
  <body>
    <table class="container">
      <thead>
        <tr>
          <th style="display: flex; padding-bottom: 24px">
            <img
              width="204.31px"
              height="42px"
              src="https://www.ttrmongolia.com/static/ttr-row.png"
              alt="TTRMongolia"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <h1 class="title">Your Payment Receipt</h1>
          </td>
        </tr>
        <tr>
          <td>
            <p class="body-text text-center">${
              created_at && new Date(created_at).toDateString()
            }</p>
            <p class="body-text text-center">${firstName} ${lastName}</p>
            <p class="body-text text-center">TransactionID: ${transactionId}</p>
            <table
              cellspacing="0"
              cellpadding="0"
              width="100%"
              bgcolor="#F7F7F7"
              style="
                margin: 0px;
                padding: 0px;
                background: rgb(247, 247, 247);
                border-collapse: collapse;
                width: 100%;
              "
            >
              <tbody>
                <tr>
                  <td
                    style="
                      border-style: solid;
                      border-width: 1px;
                      border-color: rgb(227, 227, 227);
                    "
                  >
                    <table
                      cellspacing="0"
                      cellpadding="0"
                      width="100%"
                      style="margin: 0px; padding: 0px; width: 100%"
                    >
                      <tbody>
                        <tr
                          height="10"
                          valign="middle"
                          style="
                            border: none;
                            margin: 0px;
                            padding: 0px;
                            height: 10px;
                          "
                        >
                          <td
                            colspan="4"
                            height="10"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              height: 10px;
                              font-size: 10px;
                              line-height: 10px;
                            "
                          ></td>
                        </tr>
                        <tr>
                          <td
                            width="5%"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              width: 5%;
                            "
                          ></td>
                          <td valign="middle" style="font-weight: bold">
                            ${title}
                          </td>
                          <td
                            width="20%"
                            valign="middle"
                            style="
                              text-align: right;
                              width: 20%;
                              vertical-align: top;
                            "
                          >
                            ${Number(amount).toFixed(2)} USD
                          </td>
                          <td
                            width="5%"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              width: 5%;
                            "
                          ></td>
                        </tr>
                        <tr
                          height="10"
                          valign="middle"
                          style="
                            border: none;
                            margin: 0px;
                            padding: 0px;
                            height: 10px;
                          "
                        >
                          <td
                            colspan="4"
                            height="10"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              height: 10px;
                              font-size: 10px;
                              line-height: 10px;
                            "
                          ></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td
                    style="
                      border-style: solid;
                      border-width: 1px;
                      border-color: rgb(227, 227, 227);
                    "
                  >
                    <table
                      cellspacing="0"
                      cellpadding="0"
                      width="100%"
                      style="margin: 0px; padding: 0px; width: 100%"
                    >
                      <tbody>
                        <tr
                          height="10"
                          valign="middle"
                          style="
                            border: none;
                            margin: 0px;
                            padding: 0px;
                            height: 10px;
                          "
                        >
                          <td
                            colspan="4"
                            height="10"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              height: 10px;
                              font-size: 10px;
                              line-height: 10px;
                            "
                          ></td>
                        </tr>
                        <tr>
                          <td
                            width="5%"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              width: 5%;
                            "
                          ></td>
                          <td valign="middle" style="font-weight: bold">
                            Total
                          </td>
                          <td
                            width="20%"
                            valign="middle"
                            style="
                              text-align: right;
                              width: 20%;
                              vertical-align: top;
                            "
                          >
                            ${Number(amount).toFixed(2)} USD
                          </td>
                          <td
                            width="5%"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              width: 5%;
                            "
                          ></td>
                        </tr>
                        <tr
                          height="10"
                          valign="middle"
                          style="
                            border: none;
                            margin: 0px;
                            padding: 0px;
                            height: 10px;
                          "
                        >
                          <td
                            colspan="4"
                            height="10"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              height: 10px;
                              font-size: 10px;
                              line-height: 10px;
                            "
                          ></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td
                    style="
                      border-style: solid;
                      border-width: 1px;
                      border-color: rgb(227, 227, 227);
                    "
                  >
                    <table
                      cellspacing="0"
                      cellpadding="0"
                      width="100%"
                      style="margin: 0px; padding: 0px; width: 100%"
                    >
                      <tbody>
                        <tr
                          height="10"
                          valign="middle"
                          style="
                            border: none;
                            margin: 0px;
                            padding: 0px;
                            height: 10px;
                          "
                        >
                          <td
                            colspan="4"
                            height="10"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              height: 10px;
                              font-size: 10px;
                              line-height: 10px;
                            "
                          ></td>
                        </tr>
                        <tr>
                          <td
                            width="5%"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              width: 5%;
                            "
                          ></td>
                          <td valign="middle" style="font-weight: bold">
                            Paid
                          </td>
                          <td
                            width="20%"
                            valign="middle"
                            style="
                              text-align: right;
                              width: 20%;
                              vertical-align: top;
                            "
                          >
                            ${Number(amount).toFixed(2)} USD
                          </td>
                          <td
                            width="5%"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              width: 5%;
                            "
                          ></td>
                        </tr>
                        <tr
                          height="10"
                          valign="middle"
                          style="
                            border: none;
                            margin: 0px;
                            padding: 0px;
                            height: 10px;
                          "
                        >
                          <td
                            colspan="4"
                            height="10"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              height: 10px;
                              font-size: 10px;
                              line-height: 10px;
                            "
                          ></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>
            <p class="footer-text">
              TTR Mongolia LLC, 1st Floor, 34th Apartment, Chingeltei District,
              Ulaanbaatar, MN
            </p>
          </td>
        </tr>
      </tfoot>
    </table>
  </body>
</html>
`;
    return receipt;
  }
  const {
    firstName,
    lastName,
    transactionId,
    created_at,
    peopleCount,
    pax,
    total,
    deposit,
  } = transaction as TransactionType;
  const receipt = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap"
      rel="stylesheet"
    />
    <style>
      body {
        width: 100vw;
        font-family: "Nunito Sans", sans-serif;
      }

      .container {
        width: 520px;
        margin: 0px auto;
        padding: 48px 20px;
      }
      .title {
        font-weight: 600;
        font-size: 26px;
        font-weight: 700;
        margin: 0;
        color: rgba(30, 30, 30, 0.8);
        text-align: center;
      }
      .body-text {
        font-size: 15px;
        color: rgba(30, 30, 30, 0.8);
      }
      .footer-text {
        font-size: 12px;
        color: rgba(30, 30, 30, 0.5);
        text-align: center;
      }
      .button {
        padding: 8px 32px;
        font-size: 14px;
        font-weight: 500;
        background-color: #fda403;
        border: 0;
        border-radius: 4px;
        text-decoration: none;
        color: black !important;
        cursor: pointer;
      }
      .text-center {
        text-align: center;
      }
    </style>
  </head>
  <body>
    <table class="container">
      <thead>
        <tr>
          <th style="display: flex; padding-bottom: 24px">
            <img
              width="204.31px"
              height="42px"
              src="https://www.ttrmongolia.com/static/ttr-row.png"
              alt="TTRMongolia"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <h1 class="title">Your Payment Receipt</h1>
          </td>
        </tr>
        <tr>
          <td>
            <p class="body-text text-center">${
              created_at && new Date(created_at).toDateString()
            }</p>
            <p class="body-text text-center">${firstName} ${lastName}</p>
            <p class="body-text text-center">TransactionID: ${transactionId}</p>
            <table
              cellspacing="0"
              cellpadding="0"
              width="100%"
              bgcolor="#F7F7F7"
              style="
                margin: 0px;
                padding: 0px;
                background: rgb(247, 247, 247);
                border-collapse: collapse;
                width: 100%;
              "
            >
              <tbody>
                <tr>
                  <td
                    style="
                      border-style: solid;
                      border-width: 1px;
                      border-color: rgb(227, 227, 227);
                    "
                  >
                    <table
                      cellspacing="0"
                      cellpadding="0"
                      width="100%"
                      style="margin: 0px; padding: 0px; width: 100%"
                    >
                      <tbody>
                        <tr
                          height="10"
                          valign="middle"
                          style="
                            border: none;
                            margin: 0px;
                            padding: 0px;
                            height: 10px;
                          "
                        >
                          <td
                            colspan="4"
                            height="10"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              height: 10px;
                              font-size: 10px;
                              line-height: 10px;
                            "
                          ></td>
                        </tr>
                        <tr>
                          <td
                            width="5%"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              width: 5%;
                            "
                          ></td>
                          <td valign="middle" style="font-weight: bold">
                            ${title}
                          </td>
                          <td
                            width="20%"
                            valign="middle"
                            style="
                              text-align: right;
                              width: 20%;
                              vertical-align: top;
                            "
                          >
                            ${
                              receiptType == "book"
                                ? pax.toFixed(2)
                                : Number(deposit).toFixed(2)
                            } USD
                          </td>
                          <td
                            width="5%"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              width: 5%;
                            "
                          ></td>
                        </tr>
                        ${
                          receiptType == "book"
                            ? `<tr>
                          <td
                            width="5%"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              width: 5%;
                            "
                          ></td>
                          <td colspan="3" valign="middle">${peopleCount} person</td>
                        </tr>`
                            : ""
                        }
                        <tr
                          height="10"
                          valign="middle"
                          style="
                            border: none;
                            margin: 0px;
                            padding: 0px;
                            height: 10px;
                          "
                        >
                          <td
                            colspan="4"
                            height="10"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              height: 10px;
                              font-size: 10px;
                              line-height: 10px;
                            "
                          ></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td
                    style="
                      border-style: solid;
                      border-width: 1px;
                      border-color: rgb(227, 227, 227);
                    "
                  >
                    <table
                      cellspacing="0"
                      cellpadding="0"
                      width="100%"
                      style="margin: 0px; padding: 0px; width: 100%"
                    >
                      <tbody>
                        <tr
                          height="10"
                          valign="middle"
                          style="
                            border: none;
                            margin: 0px;
                            padding: 0px;
                            height: 10px;
                          "
                        >
                          <td
                            colspan="4"
                            height="10"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              height: 10px;
                              font-size: 10px;
                              line-height: 10px;
                            "
                          ></td>
                        </tr>
                        <tr>
                          <td
                            width="5%"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              width: 5%;
                            "
                          ></td>
                          <td valign="middle" style="font-weight: bold">
                            Total
                          </td>
                          <td
                            width="20%"
                            valign="middle"
                            style="
                              text-align: right;
                              width: 20%;
                              vertical-align: top;
                            "
                          >
                            ${total.toFixed(2)} USD
                          </td>
                          <td
                            width="5%"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              width: 5%;
                            "
                          ></td>
                        </tr>
                        <tr
                          height="10"
                          valign="middle"
                          style="
                            border: none;
                            margin: 0px;
                            padding: 0px;
                            height: 10px;
                          "
                        >
                          <td
                            colspan="4"
                            height="10"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              height: 10px;
                              font-size: 10px;
                              line-height: 10px;
                            "
                          ></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td
                    style="
                      border-style: solid;
                      border-width: 1px;
                      border-color: rgb(227, 227, 227);
                    "
                  >
                    <table
                      cellspacing="0"
                      cellpadding="0"
                      width="100%"
                      style="margin: 0px; padding: 0px; width: 100%"
                    >
                      <tbody>
                        <tr
                          height="10"
                          valign="middle"
                          style="
                            border: none;
                            margin: 0px;
                            padding: 0px;
                            height: 10px;
                          "
                        >
                          <td
                            colspan="4"
                            height="10"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              height: 10px;
                              font-size: 10px;
                              line-height: 10px;
                            "
                          ></td>
                        </tr>
                        <tr>
                          <td
                            width="5%"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              width: 5%;
                            "
                          ></td>
                          <td valign="middle" style="font-weight: bold">
                            Paid
                          </td>
                          <td
                            width="20%"
                            valign="middle"
                            style="
                              text-align: right;
                              width: 20%;
                              vertical-align: top;
                            "
                          >
                            ${Number(deposit).toFixed(2)} USD
                          </td>
                          <td
                            width="5%"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              width: 5%;
                            "
                          ></td>
                        </tr>
                        <tr
                          height="10"
                          valign="middle"
                          style="
                            border: none;
                            margin: 0px;
                            padding: 0px;
                            height: 10px;
                          "
                        >
                          <td
                            colspan="4"
                            height="10"
                            valign="middle"
                            style="
                              border: none;
                              margin: 0px;
                              padding: 0px;
                              height: 10px;
                              font-size: 10px;
                              line-height: 10px;
                            "
                          ></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>
            <p class="footer-text">
              TTR Mongolia LLC, 1st Floor, 34th Apartment, Chingeltei District,
              Ulaanbaatar, MN
            </p>
          </td>
        </tr>
      </tfoot>
    </table>
  </body>
</html>
`;
  return receipt;
};
