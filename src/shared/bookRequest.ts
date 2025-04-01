export const bookRequestBody = (payload: any) => `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
    <header style="background-color: #007BFF; color: white; text-align: center; padding: 20px;">
      <h1 style="margin: 0; font-size: 24px;">New Demo Book Request</h1>
    </header>
    <main style="padding: 20px;">
      <p style="font-size: 16px; margin-left: 10px;">Hello,</p>
      <p style="font-size: 16px; margin-left: 10px;">
        A new demo book request has been submitted with the following details:
      </p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr style="background-color: #f4f4f4;">
          <th style="text-align: left; padding: 10px; border: 1px solid #ddd;">Field</th>
          <th style="text-align: left; padding: 10px; border: 1px solid #ddd;">Details</th>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">Name</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${payload.firstName}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; border: 1px solid #ddd;">Email</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${payload.email}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">Phone</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${payload.phoneNumber}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; border: 1px solid #ddd;">Reason of Call</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${payload.reasonOfCall}</td>
        </tr>
      </table>
      <p style="font-size: 16px; margin-left: 10px">
        Please review the request and take the necessary actions.
      </p>
    </main>
    <footer style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 14px; color: #666;">
      <p style="margin: 0;">© 2024 RAAYA SOCIAL. All rights reserved.</p>
    </footer>
  </div>
`;
