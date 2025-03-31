import { PagoMovilRef, ZelleRef } from '../app/models/pago';

const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');

// Configuration for Gmail
const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_APP_PASSWORD // Replace with the App Password you generated
    }
});

export async function searchPagoMovil(ref: number): Promise<PagoMovilRef | null> {
    try {
        // Connect to the server
        await client.connect();

        const senderEmail = process.env.SENDER_EMAIL;

        // Select and lock the INBOX
        const lock = await client.getMailboxLock('INBOX');
        
        try {
            // Calculate the date for one week ago
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 1);

            // Search for messages from specific sender received within the last week
            const searchCriteria = {
                from: senderEmail,
                since: oneWeekAgo
            };

            // Get UIDs of matching messages
            const uids = await client.search(searchCriteria, { uid: true });
            
            // Fetch only the matching messages
            for await (let message of client.fetch(uids, { 
                envelope: true,
                source: true
            }, { uid: true })) {
                // Parse the message source to get the body
                const { text, html } = await simpleParser(message.source);
                const bodyText = text || html;

                // Extract time (HH:mm format)
                const timeMatch = bodyText.match(/(\d{2}:\d{2})/);
                const time = timeMatch ? timeMatch[1] : null;

                // Extract date (DD/MM/YYYY format)
                const dateMatch = bodyText.match(/(\d{2}\/\d{2}\/\d{4})/);
                const date = dateMatch ? dateMatch[1] : null;

                // Check if contains "Pago recibido"
                const hasPagoRecibido = bodyText.includes('Pago recibido');

                // Extract reference number (last 6 digits)
                const refMatch = bodyText.match(/REF:(\d{12})/);
                const lastSixDigits = refMatch ? refMatch[1].slice(-6) : null;

                // Extract monto transferido
                const montoTransferidoMatch = bodyText.match(/Bs\.(\d+\.\d{2})/);
                const montoTransferido = montoTransferidoMatch ? montoTransferidoMatch[1] : null;

                if (Number(lastSixDigits) === ref) {
                    return {
                        has_pago_recibido: hasPagoRecibido,
                        referencia: Number(lastSixDigits),
                        monto_transferido: parseFloat(montoTransferido),
                        fecha: date,
                        hora: time
                    };
                }
            }
        } finally {
            // Release the lock
            lock.release();
        }

        // Logout and close connection
        await client.logout();

        // If no matching message is found, return null
        console.log('No se encontró el pago');
        return null;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};

export async function searchZelle(name: string, price: number): Promise<ZelleRef | null> {
    try {
        // Connect to the server
        await client.connect();

        const senderEmail = process.env.SENDER_EMAIL_ZELLE;

        // Select and lock the INBOX
        const lock = await client.getMailboxLock('INBOX');
        
        try {
            // Calculate the date for one week ago
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 1);

            // Search for messages from specific sender received within the last week
            const searchCriteria = {
                from: senderEmail,
                since: oneWeekAgo
            };

            // Get UIDs of matching messages
            const uids = await client.search(searchCriteria, { uid: true });
            
            // Fetch only the matching messages
            for await (let message of client.fetch(uids, { 
                envelope: true,
                source: true
            }, { uid: true })) {
                // Parse the message source to get the body
                const { text, html } = await simpleParser(message.source);
                const bodyText = text || html;

                console.log("Body del correo: ", bodyText);

                // Extract the subject line which contains the payment info
                const subject = message.envelope.subject;

                // Parse the Zelle payment information from subject
                const zellePattern = /^(.*) sent you \$(\d+\.\d{2})/;
                const match = subject.match(zellePattern);

                if (match) {
                    const [_, senderName, amount] = match;
                    const paymentAmount = parseFloat(amount);

                    // Check if name and amount match the parameters
                    if (senderName.toLowerCase() === name.toLowerCase() && 
                        paymentAmount === price) {
                        
                        // Get date from envelope
                        const emailDate = message.envelope.date;
                        const fecha = emailDate.toLocaleDateString('es-VE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        }).replace(/\//g, '/');
                        
                        const hora = emailDate.toLocaleTimeString('es-VE', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        });

                        return {
                            sender_name: senderName,
                            amount: paymentAmount,
                            fecha: fecha,
                            hora: hora
                        };
                    }
                }
            }
        } finally {
            // Release the lock
            lock.release();
        }

        // Logout and close connection
        await client.logout();

        // If no matching message is found, return null
        console.log('No se encontró el pago de Zelle');
        return null;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}