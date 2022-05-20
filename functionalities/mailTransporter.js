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

    const msgs = [
        "A wish for you on your birthday, whatever you ask may you receive, whatever you seek may you find, whatever you wish may it be fulfilled on your birthday and always. Happy birthday!",
        "Another adventure filled year awaits you. Welcome it by celebrating your birthday with pomp and splendor. Wishing you a very happy and fun-filled birthday!",
        "May the joy that you have spread in the past come back to you on this day. Wishing you a very happy birthday!",
        "This birthday, I wish you abundant happiness and love. May all your dreams turn into reality and may lady luck visit your home today. Happy birthday to one of the sweetest people I’ve ever known.",
        "May you be gifted with life’s biggest joys and never-ending bliss. After all, you yourself are a gift to earth, so you deserve the best. Happy birthday.",
        "Count your life by smiles, not tears. Count your age by friends, not years. Happy birthday!",
        "Happy birthday! I hope all your birthday wishes and dreams come true",
        "Be happy! Today is the day you were brought into this world to be a blessing and inspiration to the people around you! You are a wonderful person! May you be given more birthdays to fulfill all of your dreams!",
        "Your birthday is the first day of another 365-day journey. Be the shining thread in the beautiful tapestry of the world to make this year the best ever. Enjoy the ride.",
        "Birthdays are a new start, a fresh beginning and a time to pursue new endeavors with new goals. Move forward with confidence and courage. You are a very special person. May today and all of your days be amazing!",
        "Hope your special day brings you all that your heart desires! Here’s wishing you a day full of pleasant surprises! Happy birthday!",
        "On your birthday we wish for you that whatever you want most in life it comes to you just the way you imagined it or better. Happy birthday!",
        "It’s a smile from me… To wish you a day that brings the same kind of happiness and joy that you bring to me. Happy birthday!",
        "Happy birthday to you. From good friends and true, from old friends and new, may good luck go with you and happiness too!",
    ]

    let rndidx = ()=>{ return Math.floor( Math.random() * (msgs.length - 0 + 1) + 0 ) }

    let filename;
    let sub="mail from alumni connect";

    if (templatetype == "event")
        {filename = "eventTemplate.ejs";sub=`${templateobj.name} Event is Here🥳🎉`}

    else if(templatetype == "verification")
        {filename = "emailverificationTemplate.ejs";}

    else if(templatetype == "forgotpassword")
        {filename = "forgotpasswordTemplate.ejs";sub="Link to reset the Password";}

    else if(templatetype == "newuser")
        {filename = "newUserTemplate.ejs";sub="Welcome to Alumni Connect";}
    
    else if(templatetype == "birthday")
        {
            filename = "birthdayTemplate.ejs";sub=`Happy Birthday ${templateobj.name} 🥳🎂🎉`;
            templateobj.msg = msgs[rndidx()]
        }
    

    let reqpath = path.join(__dirname,`../views/templates/`);

    ejs.renderFile(reqpath+`${filename}`, { obj:templateobj }, function (err, data) {  
        // setup e-mail data
        console.log("path: "+reqpath + `${filename}`);
        var mailOptions = {
            from: '"Alumni Connect" <noreplyalumni@vvit.net>', // sender address (who sends)
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

