import express from 'express';
import bodyParser from 'body-parser';
import webPush from 'web-push';
import cors from 'cors';

// Generate these keys using "npx web-push generate-vapid-keys"
const vapidKeys = {
  publicKey: 'BCU1J6IJvDvGicgeYTC9Mzfym1EtSXHJfxmbdY_q06qgAIBaHmvaxcB5C3L2SvXucJgDGWn2aUnmze_GIdRLShM',
  privateKey: 'ekPcuiKJp9GPgsMZurM8JD3WakrmC1a0Nn4SLBr5-hk',
};

// Configure web-push
webPush.setVapidDetails(
  'mailto:your-email@example.com', // Replace with your email
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const app = express();
const PORT = 4000;

app.use(bodyParser.json());
app.use(cors());

// Store subscriptions (in a real app, save these in a database)
const subscriptions = [];

// Endpoint to save a subscription
app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription); // Save subscription
  console.log("subscription",subscription);
  
  res.status(201).json({ message: 'Subscription saved.' });
});

// Endpoint to send notifications to a specific subscription
app.post('/notify', (req, res) => {
  const { subscription, payload } = req.body;

  webPush
    .sendNotification(subscription, JSON.stringify(payload))
    .then(() => res.status(200).json({ message: 'Notification sent.' }))
    .catch((err) => {
      console.error('Error sending notification:', err);
      res.status(500).json({ error: 'Failed to send notification.' });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Public VAPID Key: ${vapidKeys.publicKey}`);
});