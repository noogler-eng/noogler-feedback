import * as React from 'react';

interface EmailTemplateProps {
  firstName: string
  verificationCode: string
}

export default function EmailTemplate({firstName, verificationCode}: EmailTemplateProps){
  return <div>
    <h1>Welcome, {firstName}!</h1>
    <div>this is your verification code, <i>{verificationCode}</i></div>
  </div>
}
