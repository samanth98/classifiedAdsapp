const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")

var sendMail = {
    send : function(toEmail,ccEmail,fromEmail,subject, html){
        //data verification
        //mandatory data
        if( toEmail == null )
        {
            return null;
        }

        const msg = {
            to: toEmail,
            cc: ccEmail,
            //bcc: bccEmail,
            from: fromEmail,            
            subject: subject,
            html: html
            //text: text
          }

          sgMail
            .send(msg)
            .then(() => {
            console.log('Email sent')
            })
            .catch((error) => {
            console.error(error)
            })
    },
    sendwithoutcc : function(toEmail, fromEmail, subject,  html){
        //data verification
        //mandatory data
        if( toEmail == null )
        {
            return null;
        }

        const msg = {
            to: toEmail,
            from: fromEmail,
            subject: subject,
            html: html
          }

          sgMail
            .send(msg)
            .then(() => {
            console.log('Email sent')
            })
            .catch((error) => {
            console.error(error)
            })
    }
}



module.exports = sendMail