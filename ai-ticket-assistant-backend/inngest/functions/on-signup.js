import { NonRetriableError } from "inngest";
import User from "../../models/user.js";
import { sendMail } from "../../utils/mailer.js"; // path may vary
import { inngest } from "../client.js"; // your inngest client

export const onUserSignup = inngest.createFunction(
  { id: "on-user-signup", retries: 2 },
  { event: "user/signup" },
  async ({ event, step }) => {
    try {
      const { email } = event.data;

      const user = await step.run("get-user-email", async () => {
        const userObject = await User.findOne({ email });
        if (!userObject) {
          throw new NonRetriableError("User no longer exists; stopping");
        }
        return userObject;
      });

      // 📨 Send welcome email
      await step.run("send-welcome-email", async () => {
        const subject = `Welcome to the App!`;
        const message = `Hi,
    
          \n\nThanks for signing up. We're glad to have you onboard!`;

        await sendMail(user.email, subject, message);
      });

      return { success: true };
    } catch (err) {
      console.error("❌ Error running step:", err.message);
      return { success: false };
    }
  }
);
