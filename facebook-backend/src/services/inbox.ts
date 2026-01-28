import Imap from "imap";
import { simpleParser } from "mailparser";
import InboxEmail from "../models/inboxEmail";

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
          if (!results || results.length === 0) {
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
                .then(async (parsed) => {
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
                      from: Array.isArray(parsed.from) ? (parsed.from as any[]).map((addr: any) => addr.text).join(', ') : (parsed.from as any)?.text || "",
                      to: Array.isArray(parsed.to) ? (parsed.to as any[]).map((addr: any) => addr.text).join(', ') : (parsed.to as any)?.text || "",
                      cc: Array.isArray(parsed.cc) ? (parsed.cc as any[]).map((addr: any) => addr.text).join(', ') : (parsed.cc as any)?.text || "",

                      bodyText: parsed.text || "",
                      bodyHtml: parsed.html || "",

                      date: parsed.date || new Date(),
                      hasAttachments:
                        parsed.attachments?.length > 0,
                      isRead: false,
                    },
                    { upsert: true }
                  );
                })
                .catch(console.error);
            });
          });

          fetcher.once("end", () => {
            imap.end();
            resolve();
          });
        });
      });
    });

    imap.once("error", reject);
    imap.connect();
  });
