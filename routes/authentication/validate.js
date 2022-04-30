const express = require('express');
// const ObjectID = require('mongodb').ObjectID;
const nodemailer = require('nodemailer');
const User = require('../../models/user');
const Cryptr = require('cryptr');
const md5 = require('md5');
const { find } = require('../../models/user');
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

const OAuth2_client = new OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET)
OAuth2_client.setCredentials({refresh_token:process.env.REFRESH_TOKEN})

const router = express.Router();
const cryptr = new Cryptr(process.env.TK_SECRET_KEY)


function tm(ts)
{
    var now = ts;
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now
}

function timeDifference(date1,date2)
{
    var difference = date2-date1;

    var daysDifference = Math.floor(difference/1000/60/60/24);

    return daysDifference;
}


router.get('/forgot',(req,res)=>{
    res.render('authentication/forgotPassword',{errMsg:"",loggedIn:req.isAuthenticated()})
})

router.post('/forgot',async (req,res)=>{
    const given_email = req.body.email;

    User.findOne({email:given_email},(err,foundUser)=>{
        if (!err)
        {
            if(foundUser)
            {
                
                ts = new Date()
                const encrypt_id = cryptr.encrypt(foundUser._id)
                const encrypt_ts = cryptr.encrypt(ts.getTime())

                
                const hash_str = ts.getTime().toString()+foundUser._id.toString()+foundUser.email
                
                
                const hashed = md5(hash_str)
                
                foundUser.tokenvalidate.passchangereq = true
                foundUser.save((err)=>{
                    if(err)
                        console.log(err)
                })

                try
                {
                    const email =  async ()=>{

                        const accessToken = OAuth2_client.getAccessToken()

                        const transporter = nodemailer.createTransport({
                            
                            service:'gmail',
                            auth: {
                                type:'OAuth2',
                                user: process.env.EMAIL,
                                clientId:process.env.CLIENT_ID,
                                clientSecret:process.env.CLIENT_SECRET,
                                refreshToken:process.env.REFRESH_TOKEN,
                                accessToken:accessToken
                            },
                            secure: true, // upgrades later with STARTTLS -- change this based on the PORT
                        });
        
        
                        const mailData = {
                            from: 'ALUMNI Connect : noreply-vvit-alumni@gmail.com',
                            to: given_email,
                            subject: "Link to reset the Password",
                            text: "hi there click on the below link to reset the password",
                            html: '<b>Hey there! </b><br><a href="http://localhost:5000/validate/'+encrypt_ts+'/'+encrypt_id+'/'+hashed+'">http://localhost:5000/validate/'+encrypt_ts+'/'+encrypt_id+'/'+hashed+'</a><br/>',
                        };
                        
                        console.log("mail sent________________")
                        try
                        {
                            await transporter.sendMail(mailData)
                            transporter.close();
                        }
                        catch
                        {
                            return "error"
                        }
                        
                    }
                    
                    // sending the mail 
                    let resp = email()
                    // console.log(res)
                    res.render("authentication/message",{msg:"mailsent",loggedIn:req.isAuthenticated()})
                    // res.status(200).send({ message: "Mail send" });
                }
                catch
                {
                    res.render("authentication/message",{msg:"mailnotsent",loggedIn:req.isAuthenticated()})
                    // res.status(500).send({ message: "err" });
                }
                
                
                
            }
            else
            {
                // user not found
                res.render('authentication/forgotPassword',{errMsg:"No User found with given email",loggedIn:req.isAuthenticated()})
            }


        }
        else
        {
            // err occured while finding the user
            return console.log(err)
        }
    })

})

router.post('/changepassword',(req,res)=>{
    const pass = req.body.password;
    const password = cryptr.encrypt(pass);
    
    if(req.cookies.pass_prop)
    {
        const obj = req.cookies.pass_prop
        const link = '/validate/'+obj.ts+'/'+obj.id+'/'+obj.hs+'/'+password
        res.redirect(link)
    }
    else
    {
        res.render("authentication/newpassword",{errMsg:"something went wrong with cookies",loggedIn:req.isAuthenticated()})
        // res.status(404,{message:"something went wrong with cookies"})
    }
    
})

router.get('/:timestamp/:id/:hash',(req,res)=>{
    
    
    const ts = cryptr.decrypt(req.params.timestamp)
    const id = cryptr.decrypt(req.params.id)
    const cur_time = new Date()
    
    if(timeDifference(parseInt(ts),cur_time.getTime()) < 1)
    {
        User.findById(id,(err,user)=>{

            
            if(user)
            {
                if(user.tokenvalidate.passchangereq)
                {
                    const hash_str = ts+id+user.email
                    const hashed = md5(hash_str)

                    if(hashed == req.params.hash && user.tokenvalidate.passchangereq)
                    {
                        
                        reset_obj ={
                            id:req.params.id,
                            ts:req.params.timestamp,
                            hs:req.params.hash
                        }
                        res.cookie("pass_prop",reset_obj)   // creating cookie
                        res.render("authentication/newpassword",{errMsg:"",loggedIn:req.isAuthenticated()})
                    }
                }
                else
                {
                    res.render("authentication/message",{msg:"tkused",loggedIn:req.isAuthenticated()})
                    // res.status(500).send({message:"user has not requested for the pass change"})
                }
            }
            else
            {
                res.render("authentication/message",{msg:"nouser",loggedIn:req.isAuthenticated()})
                // res.status(500).send({message:"user not found"})
            }
        })
    }
    else
    {
        res.render("authentication/message",{msg:"tkexpired",loggedIn:req.isAuthenticated()})
        // res.status(500).send({message:"link experied"})
    }
})


router.get('/:timestamp/:id/:hash/:pass',(req,res)=>{
    
    // const static_obj = new ObjectID()

    
    const ts = cryptr.decrypt(req.params.timestamp)
    const id = cryptr.decrypt(req.params.id)
    const pass = cryptr.decrypt(req.params.pass)

    const cur_time = new Date()
    

    if(timeDifference(parseInt(ts),cur_time.getTime()) < 1)
    {
        User.findById(id,(err,user)=>{

            if(user)
            {
                if(user.tokenvalidate.passchangereq)
                {
                    const hash_str = ts+id+user.email
                    const hashed = md5(hash_str)
        
                    if(hashed == req.params.hash)
                    {

                        user.setPassword(pass,(err,re)=>{
                            if(!err)
                            {
                                user.tokenvalidate.passchangereq = false
                                user.save();
                                
                                console.log("reset success")
                                res.clearCookie("pass_prop");
                                res.render("authentication/message",{msg:"tkused",loggedIn:req.isAuthenticated()})
                                // res.status(200).send({message:"reset successful"})
                            }
                            else
                                return console.log("err "+err);
                        })
                    }
                    else
                    {
                        res.render('404');
                    }
                }
                else
                {
                    res.render("authentication/message",{msg:"tkused",loggedIn:req.isAuthenticated()})
                    // res.status(500).send({message:"user has not requested for the pass change"})
                }
            }
            else
            {
                res.render("authentication/message",{msg:"nouser",loggedIn:req.isAuthenticated()})
                // res.status(500).send({message:"user not found"})
            }
        })
    }
    else
    {
        res.render("authentication/message",{msg:"tkexpired",loggedIn:req.isAuthenticated()})
        // res.status(500).send({message:"link experied"})
    }
})



module.exports = router;