import Imap from "imap";
import {
  simpleParser,
  ParsedMail,
  AddressObject,
} from "mailparser";
import InboxEmail from "../models/inboxEmail";

/* =========================
   HELPERS
========================= */
const getAddressText = (
  address?: AddressObject | AddressObject[]
): string => {
  if (!address) return "";

  if (Array.isArray(address)) {
    return address
      .map((a) => a.text)
      .filter(Boolean)
      .join(", ");
  }

  return address.text || "";
};

/* =========================
   FETCH FOLDER EMAILS
========================= */
export const fetchFolderEmails = (
  mailbox: any,
  folder: string
) =>
  new Promise<void>((resolve, reject) => {
    const imap = new Imap({
      user: mailbox.imap.user,
      password: mailbox.imap.pass,
      host: mailbox.imap.host,
      port: Number(mailbox.imap.port),
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    });

    imap.once("ready", () => {
      imap.openBox(folder, false, (err) => {
        if (err) {
          console.error(`❌ OPEN ${folder} ERROR`, err);
          imap.end();
          return resolve();
        }

        imap.search(["ALL"], (err, results) => {
          if (err || !results || results.length === 0) {
            imap.end();
            return resolve();
          }

          const fetcher = imap.fetch(results, {
            bodies: "",
            struct: true,
            markSeen: false,
          });

          fetcher.on("message", (msg) => {
            msg.on("body", (stream) => {
              simpleParser(stream)
                .then(async (parsed: ParsedMail) => {
                  const messageId =
                    parsed.messageId ||
                    `${mailbox._id}-${Date.now()}`;

                  await InboxEmail.updateOne(
                    { mailboxId: mailbox._id, messageId },
                    {
                      mailboxId: mailbox._id,
                      messageId,
                      folder,

                      subject: parsed.subject || "(No Subject)",
                      from: getAddressText(parsed.from),
                      to: getAddressText(parsed.to),
                      cc: getAddressText(parsed.cc),

                      bodyText: parsed.text || "",
                      bodyHtml: parsed.html || "",

                      date: parsed.date || new Date(),
                      hasAttachments:
                        (parsed.attachments?.length || 0) > 0,
                      isRead: false,
                    },
                    { upsert: true }
                  );
                })
                .catch((err) => {
                  console.error("Mail parse error:", err);
                });
            });
          });

          fetcher.once("end", () => {
            imap.end();
            resolve();
          });
        });
      });
    });

    imap.once("error", (err) => {
      console.error("IMAP error:", err);
      reject(err);
    });

    imap.connect();
  });
