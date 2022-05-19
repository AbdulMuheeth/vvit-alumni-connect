const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const sendanemail = (tolist,templatetype,templateobj)=>{

    var transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
        ciphers:'SSLv3'
        },
        auth: {
            user: process.env.OUTLOOK_EMAIL,
            pass: process.env.OUTLOOK_PASS
        }
    });

    let filename;
    let sub="mail from alumni connect";
    if (templatetype == "event")
        {filename = "eventTemplate.ejs";sub=`${templateobj.name} Event is Here🥳🎉`}

    else if(templatetype == "verification")
        {filename = "emailverificationTemplate.ejs";}
    
    let reqpath = path.join(__dirname,`../views/templates/`);

    ejs.renderFile(reqpath+`${filename}`, { obj:templateobj }, function (err, data) {  
        // setup e-mail data
        console.log("path: "+reqpath + `${filename}`);
        var mailOptions = {
            from: '"Alumni Connect" <19bq1a05j8@vvit.net>', // sender address (who sends)
            to: tolist, // list of receivers (who receives)
            subject: sub, // Subject line
            html: data // html body
        };
    
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
    
            console.log('Message sent: ' + info.response);
        });
    });

}

module.exports = { sendanemail }

