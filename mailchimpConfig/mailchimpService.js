// mailchimpService.js
import axios from 'axios';
import { mailchimpApiKey, audienceId } from './mailchimp.js';

const mailchimpAPIBase = 'https://us14.api.mailchimp.com/3.0'; // Replace <dc> with your Mailchimp data center (e.g., us5)


export const fetchSubscribers = async () => {
  try {
        const response = await axios.get(`${mailchimpAPIBase}/lists/${audienceId}/members`, {
            auth: {
                username: 'subscriber', // Mailchimp requires any string as the username
                password: mailchimpApiKey, // Your Mailchimp API Key
            },
            params: {
                status: 'subscribed', // Fetch only subscribed users
            },
        });
        // Extract subscribers' emails from the response
        const subscribers = response.data.members.map((member) => member.email_address);
        return subscribers;
    } catch (error) {
        console.error('Error fetching subscribers from Mailchimp:', error);
        throw error; // Handle error appropriately
    }
};
