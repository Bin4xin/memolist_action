const Imap = require('imap');
const { simpleParser } = require('mailparser');
const fs = require('fs/promises');
const path = require('path');

// Configure IMAP connection
const imapConfig = {
  user: process.env.EMAIL_USERNAME,
  password: process.env.EMAIL_PASSWORD,
  host: process.env.IMAP_SERVER,
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
};

// Parse email subject to get memo ID
function parseMemoId(subject) {
  const match = subject.match(/Update Memo #(\d+)/i);
  return match ? parseInt(match[1]) : null;
}

// Parse email body to get new status
function parseStatus(body) {
  const match = body.match(/Status:\s*(completed|pending)/i);
  return match ? match[1].toLowerCase() : null;
}

// Update memo status in memos.json
async function updateMemoStatus(memoId, newStatus) {
  const memoPath = path.join(process.cwd(), 'public', 'data', 'memos.json');
  
  try {
    const data = await fs.readFile(memoPath, 'utf8');
    const memos = JSON.parse(data);
    
    const memo = memos.memos.find(m => m.id === memoId);
    if (memo) {
      memo.status = newStatus;
      await fs.writeFile(memoPath, JSON.stringify(memos, null, 2));
      console.log(`Updated memo #${memoId} status to ${newStatus}`);
      return true;
    }
    
    console.log(`Memo #${memoId} not found`);
    return false;
  } catch (error) {
    console.error('Error updating memo:', error);
    return false;
  }
}

// Process new emails
function processEmails(imap) {
  return new Promise((resolve, reject) => {
    imap.openBox('INBOX', false, (err, box) => {
      if (err) {
        reject(err);
        return;
      }

      // Search for unread emails from the last hour
      const lastHour = new Date();
      lastHour.setHours(lastHour.getHours() - 1);
      
      imap.search(['UNSEEN', ['SINCE', lastHour]], (err, results) => {
        if (err) {
          reject(err);
          return;
        }

        if (!results.length) {
          console.log('No new emails to process');
          resolve();
          return;
        }

        const fetch = imap.fetch(results, { bodies: '' });
        
        fetch.on('message', (msg) => {
          msg.on('body', async (stream) => {
            try {
              const parsed = await simpleParser(stream);
              const memoId = parseMemoId(parsed.subject);
              const newStatus = parseStatus(parsed.text);

              if (memoId && newStatus) {
                await updateMemoStatus(memoId, newStatus);
              }
            } catch (error) {
              console.error('Error processing message:', error);
            }
          });
        });

        fetch.on('error', (err) => {
          console.error('Fetch error:', err);
        });

        fetch.on('end', () => {
          console.log('Finished processing emails');
          resolve();
        });
      });
    });
  });
}

// Main function
async function main() {
  const imap = new Imap(imapConfig);

  imap.once('ready', async () => {
    try {
      await processEmails(imap);
    } catch (error) {
      console.error('Processing error:', error);
    } finally {
      imap.end();
    }
  });

  imap.once('error', (err) => {
    console.error('IMAP error:', err);
    process.exit(1);
  });

  imap.once('end', () => {
    console.log('IMAP connection ended');
    process.exit(0);
  });

  imap.connect();
}

main().catch(console.error);