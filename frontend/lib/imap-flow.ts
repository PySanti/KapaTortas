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

export default async function searchEmails(senderEmail: string) {
    try {
        // Connect to the server
        await client.connect();

        // Select and lock the INBOX
        const lock = await client.getMailboxLock('INBOX');
        
        try {
            // Calculate the date for one week ago
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            // Search for messages from specific sender received within the last week
            const searchCriteria = {
                from: senderEmail,
                since: oneWeekAgo
            };

            // Get UIDs of matching messages
            const uids = await client.search(searchCriteria, { uid: true });
            
            if (uids.length === 0) {
                console.log(`No emails found from ${senderEmail} in the last week`);
                return;
            }
            
            console.log(`Found ${uids.length} matching emails from ${senderEmail} in the last week`);
            
            // Fetch only the matching messages
            for await (let message of client.fetch(uids, { 
                envelope: true,
                source: true
            }, { uid: true })) {
                // Parse the message source to get the body
                const { text, html } = await simpleParser(message.source);
                
                console.log(`From: ${message.envelope.from[0].address}`);
                console.log(`Subject: ${message.envelope.subject}`);
                console.log(`Date: ${message.envelope.date}`);
                console.log('Body:', text || html); // Prefer text, fallback to HTML
                console.log('------------------------');
            }
        } finally {
            // Release the lock
            lock.release();
        }

        // Logout and close connection
        await client.logout();
    } catch (error) {
        console.error('Error:', error);
    }
};
