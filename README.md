# Personal Memo Website

A simple and elegant personal memo website that allows you to manage your memos through email integration and Github Actions. The website displays your memos with their status and automatically updates when you send email commands.

## Features

- 📝 Display memos with title, description, and status
- 📧 Email-based memo management
- 🔄 Automatic updates via Github Actions
- 📱 Responsive design
- 🚀 Fast deployment with Github Pages

## Setup and Deployment

1. Create a new Github repository
2. Clone this repository and push to your new repository:

```bash
# Clone the repository
git clone <your-repository-url>
cd <repository-name>

# Initialize and push the code
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```

3. Configure Github Pages:
   - Go to repository Settings > Pages
   - Set Source to 'Github Actions'

4. Add repository secrets (Settings > Secrets and variables > Actions):
   - `EMAIL_USERNAME`: Your email username
   - `EMAIL_PASSWORD`: Your email password (use app password for security)
   - `IMAP_SERVER`: Your email server (e.g., imap.gmail.com)

## Usage Guide

### Adding a New Memo

Send an email with:

```
Subject: Add New Memo
Body:
title: Your Memo Title
description: Your memo description
status: pending
```

### Updating Memo Status

To change a memo's status, send an email with:

```
Subject: Update Memo #[ID]
Body:
Status: completed
```

or

```
Subject: Update Memo #[ID]
Body:
Status: pending
```

Replace [ID] with the actual memo ID (visible in the website interface).

### Deleting a Memo

To delete a memo, send an email with:

```
Subject: Delete Memo #[ID]
Body:
action: delete
```

Replace [ID] with the ID of the memo you want to delete.

## Email Examples

### Example 1: Adding a New Memo

```
Subject: Add New Memo
Body:
title: Complete Project Documentation
description: Write comprehensive documentation for the current project including setup instructions and API endpoints.
status: pending
```

### Example 2: Updating Status

```
Subject: Update Memo #1
Body:
Status: completed
```

### Example 3: Deleting a Memo

```
Subject: Delete Memo #1
Body:
action: delete
```

## Important Notes

1. Email commands are case-insensitive
2. Status can only be 'pending' or 'completed'
3. Memo updates are processed every 30 minutes
4. You'll see the changes on the website after the next automatic deployment
5. Make sure to use the correct memo ID when updating or deleting

## Troubleshooting

### Common Issues

1. Memo not updating?
   - Check if you used the correct memo ID
   - Wait for up to 30 minutes for the update to process
   - Verify your email format matches the examples

2. Email not being processed?
   - Check if your email credentials are correctly set in Github Secrets
   - Verify your email server settings
   - Make sure you're sending from the authorized email address

3. Website not reflecting changes?
   - Changes may take a few minutes to appear after processing
   - Check the Github Actions tab for deployment status
   - Clear your browser cache

## Support

If you encounter any issues or need assistance, please:
1. Check the troubleshooting section above
2. Review Github Actions logs for any errors
3. Open an issue in the repository

## License

MIT License - feel free to use and modify for your own purposes.