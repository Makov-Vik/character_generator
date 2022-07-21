const Vonage = require('@vonage/server-sdk');
import * as dotenv from 'dotenv';
import * as env from 'env-var';
dotenv.config();

const vonage = new Vonage({
  apiKey: env.get('API_KEY_SMS').required().asString(),
  apiSecret: env.get('API_SECRET_SMS').required().asString(),
});

export async function sendSms(
  from: string,
  to: string,
  text: string,
): Promise<void> {
  await vonage.message.sendSms(
    from,
    to,
    text,
    {},
    (err: unknown, responseData: { messages: { [x: string]: unknown }[] }) => {
      if (err) {
        console.log(err);
      } else {
        if (responseData.messages[0]['status'] === '0') {
          console.log('Message sent successfully.');
        } else {
          console.log(
            `Message failed with error: ${responseData.messages[0]['error-text']}`,
          );
        }
      }
    },
  );
}
