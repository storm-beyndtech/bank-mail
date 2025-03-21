"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplate = emailTemplate;
function emailTemplate(title, bodyContent) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background: #f4f4f4;
        }
        table {
          max-width: 600px;
          width: 100%;
          margin: 0 auto;
          border-spacing: 0;
        }

        .head{
          background: #13160F;
        }

        .footer {
          font-size: 12px;
          color: #fafafa;
          background: #13160F;
          padding: 20px;
        }
      </style>
    </head>
    <body>
      <table role="presentation" style="width: 100%; background-color: #f4f4f4;">
        <tr>
          <td style="padding: 20px 0;">
            <table role="presentation">
              <!-- Header Section with Logo -->
              <tr>
                <td class="head" style="padding: 20px;">
                  <img src="https://instantsglobal-p.com/logo.png" alt="Logo" style="max-width: 120px; margin: 0 auto;">
                </td>
              </tr>
              <!-- Body Content Section -->
              <tr>
                  ${bodyContent}
              </tr>
              <!-- Footer Section -->
              <tr>
                <td class="footer">
                  <p>© 2025 Instantsglobal | All Rights Reserved</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>    
  `;
}
