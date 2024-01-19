import { Resend } from "resend";

import GithubAccessTokenEmail from "./components/sample-email";

export default function Home() {
  const sendEmail = async () => {
    "use server";

    const resend = new Resend(process.env.RESEND_KEY);

    const { data } = await resend.contacts.list({
      audienceId: process.env.RESEND_AUD as string,
    });

    const res = await resend.batch.send(
      data.data.map((contact) => ({
        from: "chris@codinginpublic.dev",
        to: contact.email,
        subject: `Sample ${contact.first_name}`,
        react: <GithubAccessTokenEmail username={contact.first_name} />,
      }))
    );

    console.log(res);
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const resend = new Resend(process.env.RESEND_KEY);

    const { name, email } = Object.fromEntries(formData);

    // check - clean data, validation

    const { data } = await resend.contacts.create({
      email: email as string,
      firstName: name as string,
      unsubscribed: false,
      audienceId: process.env.RESEND_AUD as string,
    });

    console.log(data);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="border-2 border-white p-8">
        <form action={signUp} className="grid gap-2">
          <label htmlFor="name">First Name</label>
          <input type="text" name="name" id="name" required />
          <label htmlFor="email">Your Email</label>
          <input type="text" name="email" id="email" required />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div className="border-2 border-white p-8">
        <form action={sendEmail} className="grid gap-2">
          <button type="submit">Send Email</button>
        </form>
      </div>
    </main>
  );
}
