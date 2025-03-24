import Imap from 'imap';
import { simpleParser } from 'mailparser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure email connection
const imap = new Imap({
  user: process.env.EMAIL_USERNAME,
  password: process.env.EMAIL_PASSWORD,
  host: process.env.IMAP_SERVER,
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
});

// Path to memos.json file
const MEMOS_FILE = path.join(process.cwd(), 'public', 'data', 'memos.json');

// Read memos from JSON file
function readMemos() {
  try {
    const data = fs.readFileSync(MEMOS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading memos file:', error);
    return { memos: [] };
  }
}

// Write memos to JSON file
function writeMemos(memos) {
  try {
    fs.writeFileSync(MEMOS_FILE, JSON.stringify(memos, null, 2));
  } catch (error) {
    console.error('Error writing memos file:', error);
  }
}

// Process email content
function processEmail(subject, body) {
  const memos = readMemos();

  // Handle Add New Memo
  if (subject.toLowerCase() === 'add new memo') {
    const lines = body.split('\n');
    const memo = {
      id: (Math.max(...memos.memos.map(m => parseInt(m.id)), 0) + 1).toString(),
      title: '',
      description: '',
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };

    lines.forEach(line => {
      const [key, value] = line.split(':').map(s => s.trim());
      if (key && value) {
        if (key.toLowerCase() === 'title') memo.title = value;
        if (key.toLowerCase() === 'description') memo.description = value;
        if (key.toLowerCase() === 'status' && ['pending', 'completed'].includes(value.toLowerCase())) {
          memo.status = value.toLowerCase();
        }
      }
    });

    if (memo.title) {
      memos.memos.push(memo);
      writeMemos(memos);
      console.log('Added new memo:', memo);
    }
  }

  // Handle Update Memo Status
  const updateMatch = subject.match(/update memo #(\d+)/i);
  if (updateMatch) {
    const memoId = updateMatch[1];
    const statusMatch = body.match(/status:\s*(completed|pending)/i);

    if (statusMatch) {
      const newStatus = statusMatch[1].toLowerCase();
      const memoIndex = memos.memos.findIndex(m => m.id === memoId);

      if (memoIndex !== -1) {
        memos.memos[memoIndex].status = newStatus;
        writeMemos(memos);
        console.log(`Updated memo #${memoId} status to ${newStatus}`);
      }
    }
  }

  // Handle Delete Memo
  const deleteMatch = subject.match(/delete memo #(\d+)/i);
  if (deleteMatch) {
    const memoId = deleteMatch[1];
    const memoIndex = memos.memos.findIndex(m => m.id === memoId);

    if (memoIndex !== -1) {
      memos.memos.splice(memoIndex, 1);
      writeMemos(memos);
      console.log(`Deleted memo #${memoId}`);
    }
  }
}

// Connect to email and process new messages
function processEmails() {
  imap.once('ready', () => {
    imap.openBox('INBOX', false, (err, box) => {
      if (err) throw err;

      // Search for unread messages
      imap.search(['UNSEEN'], (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
          console.log('No new messages');
          imap.end();
          return;
        }

        const fetch = imap.fetch(results, { bodies: '' });

        fetch.on('message', (msg) => {
          msg.on('body', (stream) => {
            simpleParser(stream, (err, parsed) => {
              if (err) throw err;
              processEmail(parsed.subject, parsed.text);
            });
          });
        });

        fetch.once('error', (err) => {
          console.error('Fetch error:', err);
        });

        fetch.once('end', () => {
          console.log('Done processing messages');
          imap.end();
        });
      });
    });
  });

  imap.once('error', (err) => {
    console.error('IMAP error:', err);
  });

  imap.once('end', () => {
    console.log('Connection ended');
  });

  imap.connect();
}

// Start processing emails
processEmails();