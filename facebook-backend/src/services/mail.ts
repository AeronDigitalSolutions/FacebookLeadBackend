import nodemailer from "nodemailer";
import Imap from "imap";

export const testSMTP = async (smtp: any) => {
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: Number(smtp.port),
    secure: false, // MUST be false for 587
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
    tls: {
      rejectUnauthorized: false, // 🔥 REQUIRED FOR HOSTINGER
    },
  });

  await transporter.verify();
};

export const testIMAP = (imap: any) =>
  new Promise((resolve, reject) => {
    const client = new Imap({
      user: imap.user,
      password: imap.pass,
      host: imap.host,
      port: Number(imap.port),
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false, // 🔥 REQUIRED
      },
    });

    client.once("ready", () => {
      client.end();
      resolve(true);
    });

    client.once("error", (err) => {
      reject(err);
    });

    client.connect();
  });
