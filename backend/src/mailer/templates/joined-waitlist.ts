export const joinedWaitlist = (email: string) => ({
  subject: 'You have joined the waitlist for OraculoAI',
  message: `
        <p>
          Hi ${email},
        </p>
        <p>
          You have joined the waitlist for OraculoAI.
        </p>
        <p>
          We will notify you once you are off the waitlist.
        </p>
        <p>
          If you have any questions, feel free to reach out to us at
          <a href="mailto:oraculoai.bot@gmail.com">oraculoai.bot@gmail.com</a>.
        </p>
        <p>
          Best,
          <br />
          OraculoAI Team
        </p>
      `,
});
