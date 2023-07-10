const sgMail = require('@sendgrid/mail')
const API_KEY = process.env.SENDGRID_PASSWORD
const { signUp } = require('../Emails/SignupTemplate')
const { ForgotPasswordEmailTemplate } = require('../Emails/ForgotPasswordEmailTemplate')
const { ForgotPasswordEmailTemplateForMobile } = require('../Emails/forgotPasswordForMobile')
const { updatePasswordTemplate } = require('../Emails/UpdatePasswordTemplate')
const { suspendAndUnsuspendTemplate } = require('../Emails/SuspendAndUnsuspendEmailTemplate')
const { InviteTeamTemplate } = require('../Emails/InviteTeamTemplate')
const { quotationMSG } = require('../Emails/quotationTemplate')
const { leaInvoiceMSG } = require('../Emails/leadInvoiceTemplate')
const { leadMSG } = require('../Emails/LeadTemplate')
const { completeRegMSG } = require('../Emails/CompleteRegister')
const { doneRegMSG } = require('../Emails/DoneRegistrationFrom')
const { subscriptionPackageMSG } = require('../Emails/subcriptionPackageEmail')
const { alertRegistrationMSG } = require('../Emails/AlertRegistration')
const { invoiceCancellationMSG } = require('../Emails/InvoiceCancellation')

//* Email Verification
exports.EmailVerify = async (verifyURL, newUser) => {
    sgMail.setApiKey(API_KEY);
    const message = {
        to: newUser.email,
        from: process.env.EMAIL_FROM,
        subject: `${process.env.EMAIL_HEADER_DOMAIN_NAME} | Verification email`,
        text: `Hi From ${process.env.EMAIL_HEADER_DOMAIN_NAME}`,
        html: signUp(verifyURL, newUser)
    }
    sgMail.send(message)
        .then(response => { console.log("Email verified successfully : ", response) })
        .catch(err => { console.log("Email verify : ", err.message) })
}
//* End

//* Forget Email
exports.forgetEmail = async (resetURL, userDet) => {
    sgMail.setApiKey(API_KEY);
    const message = {
        to: userDet.email,
        from: process.env.EMAIL_FROM,
        subject: `${process.env.EMAIL_HEADER_DOMAIN_NAME} | Password Reset`,
        text: `Hi From ${process.env.EMAIL_HEADER_DOMAIN_NAME}`,
        html: ForgotPasswordEmailTemplate(resetURL, userDet)
    }
    sgMail.send(message)
        .then(response => { console.log(response) })
        .catch(err => { console.log(err.message) })
}
//* End


//* Forget Password for mobile
exports.forgetEmailMobile = async (OTP_Token, userDet) => {
    sgMail.setApiKey(API_KEY);
    const message = {
        to: userDet.email,
        from: process.env.EMAIL_FROM,
        subject: `${process.env.EMAIL_HEADER_DOMAIN_NAME} | Password Reset`,
        text: `Hi From ${process.env.EMAIL_HEADER_DOMAIN_NAME}`,
        html: ForgotPasswordEmailTemplateForMobile(OTP_Token, userDet)
    }
    sgMail.send(message)
        .then(response => { console.log(response) })
        .catch(err => { console.log(err.message) })
}
//* End

//* Forget Email
exports.updatePasswordEmail = async (user, displayMessage) => {
    sgMail.setApiKey(API_KEY);
    const message = {
        to: user.email,
        from: process.env.EMAIL_FROM,
        subject: `${process.env.EMAIL_HEADER_DOMAIN_NAME} | Password reset / updated`,
        text: `${process.env.EMAIL_HEADER_DOMAIN_NAME}`,
        html: updatePasswordTemplate(user, displayMessage)
    }
    sgMail.send(message)
        .then(response => { console.log(response) })
        .catch(err => { console.log(err.message) })
}
//* End

//* Suspended and un-suspended Email
exports.SuspendAndUnSuspend = async (data, displayMessage) => {
    sgMail.setApiKey(API_KEY);
    const message = {
        to: data.email,
        from: process.env.EMAIL_FROM,
        subject: `${process.env.EMAIL_HEADER_DOMAIN_NAME} | ${displayMessage}`,
        text: `${process.env.EMAIL_HEADER_DOMAIN_NAME}`,
        html: suspendAndUnsuspendTemplate(data, displayMessage)
    }
    sgMail.send(message)
        .then(response => { console.log(response) })
        .catch(err => { console.log(err.message) })
}
//* End

//* add a team member Email
exports.addTeamMemberEmailMessage = async (data, passwordGenerator) => {
    sgMail.setApiKey(API_KEY);
    const message = {
        to: data.email,
        from: process.env.EMAIL_FROM,
        subject: `${process.env.EMAIL_HEADER_DOMAIN_NAME} | Team Invitation `,
        text: `${process.env.EMAIL_HEADER_DOMAIN_NAME}`,
        html: InviteTeamTemplate(data, passwordGenerator)
    }
    sgMail.send(message)
        .then(response => { console.log(response) })
        .catch(err => { console.log(err.message) })
}
//* End


//* Lead email message
exports.leadMessage = async (email, phoneNumber, firstName, lastName, description) => {
    sgMail.setApiKey(API_KEY);
    const message = {
        to: process.env.SALES_EMAIL,
        from: process.env.SALES_EMAIL,
        subject: `${process.env.EMAIL_HEADER_DOMAIN_NAME} | Leads`,
        text: `${process.env.EMAIL_HEADER_DOMAIN_NAME}`,
        html: leadMSG(email, phoneNumber, firstName, lastName, description)
    }
    sgMail.send(message)
        .then(response => { console.log(response) })
        .catch(err => { console.log(err.message) })
}
//* End


//* Quotation email
exports.QuotationFunc = async (quotation, leadInvoiceNumber, invoiceSettingId, savedLeadInvoice, createdDate, dueDate) => {
    sgMail.setApiKey(API_KEY);
    const message = {
        to: quotation.email,
        from: process.env.SALES_EMAIL,
        subject: `${process.env.EMAIL_HEADER_DOMAIN_NAME} | quotation`,
        text: `${process.env.EMAIL_HEADER_DOMAIN_NAME}`,
        html: quotationMSG(quotation, leadInvoiceNumber, invoiceSettingId, savedLeadInvoice, createdDate, dueDate)
    }
    sgMail.send(message)
        .then(response => { console.log(response) })
        .catch(err => { console.log(err.message) })
}
//* End




//* Quotation email
exports.LeadInvoiceFunc = async (LeadDet, leadInvoiceNumber, invoiceSettingId, savedLeadInvoice, createdDate, dueDate, invoiceStatus) => {
    sgMail.setApiKey(API_KEY);
    const message = {
        to: LeadDet.email,
        from: process.env.INVOICE_EMAIL,
        subject: `${process.env.EMAIL_HEADER_DOMAIN_NAME} | Invoice`,
        text: `${process.env.EMAIL_HEADER_DOMAIN_NAME}`,
        html: leaInvoiceMSG(LeadDet, leadInvoiceNumber, invoiceSettingId, savedLeadInvoice, createdDate, dueDate, invoiceStatus)
    }
    sgMail.send(message)
        .then(response => { console.log(response) })
        .catch(err => { console.log(err.message) })
}
//* End



//* Complete Registration  email
exports.completeRegFunc = async (email, id, invoiceId, firstName, lastName, status) => {
    sgMail.setApiKey(API_KEY);
    const message = {
        to: email,
        from: process.env.PROVISION_EMAIL,
        subject: `${process.env.EMAIL_HEADER_DOMAIN_NAME} | Register`,
        text: `${process.env.EMAIL_HEADER_DOMAIN_NAME}`,
        html: completeRegMSG(email, id, invoiceId, firstName, lastName, status)
    }
    sgMail.send(message)
        .then(response => { console.log(response) })
        .catch(err => { console.log(err.message) })
}
//* End


//* Registration form done
exports.doneRegFunc = async (firstName, lastName) => {
    sgMail.setApiKey(API_KEY);
    const message = {
        to: process.env.EMAIL_FROM,
        from: process.env.PROVISION_EMAIL,
        subject: `${process.env.EMAIL_HEADER_DOMAIN_NAME} | Completed`,
        text: `${process.env.EMAIL_HEADER_DOMAIN_NAME}`,
        html: doneRegMSG(firstName, lastName)
    }
    sgMail.send(message)
        .then(response => { console.log(response) })
        .catch(err => { console.log(err.message) })
}





//* Registration form done
exports.subscriptionPackageFunc = async (email, firstName, lastName, duration) => {
    sgMail.setApiKey(API_KEY);
    const message = {
        to: email,
        from: process.env.PROVISION_EMAIL,
        subject: `${process.env.EMAIL_HEADER_DOMAIN_NAME} | License`,
        text: `${process.env.EMAIL_HEADER_DOMAIN_NAME}`,
        html: subscriptionPackageMSG(firstName, lastName, duration)
    }
    sgMail.send(message)
        .then(response => { console.log(response) })
        .catch(err => { console.log(err.message) })
}





//* Registration form done
exports.alertWrongRegistrationFunc = async (email, firstName, lastName, phoneNumber) => {
    sgMail.setApiKey(API_KEY);
    const message = {
        to: "admin@faspro24.com",
        from: process.env.PROVISION_EMAIL,
        subject: `${process.env.EMAIL_HEADER_DOMAIN_NAME} | Alert`,
        text: `${process.env.EMAIL_HEADER_DOMAIN_NAME}`,
        html: alertRegistrationMSG(firstName, lastName, email, phoneNumber)
    }
    sgMail.send(message)
        .then(response => { console.log(response) })
        .catch(err => { console.log(err.message) })
}



//* Canceled invoice
exports.invoiceCancellationFunc = async (invoiceNumber, email, firstName, lastName) => {
    sgMail.setApiKey(API_KEY);
    const message = {
        to: email,
        from: process.env.PROVISION_EMAIL,
        subject: `${process.env.EMAIL_HEADER_DOMAIN_NAME} | Invoice Canceled`,
        text: `${process.env.EMAIL_HEADER_DOMAIN_NAME}`,
        html: invoiceCancellationMSG(invoiceNumber, firstName, lastName, email)
    }
    sgMail.send(message)
        .then(response => { console.log(response) })
        .catch(err => { console.log(err.message) })
}