const nodemailer = require('../config/nodemailer');

//this is another way of exporting a method
exports.newComment = (comment) => {
    // console.log('inside newComment mailer',comment);

    let htmlString = nodemailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');

    nodemailer.transporter.sendMail({
        from:'bhavesh@socialM.in',
        to:comment.user.email,
        subject:"New Comment",
        html:htmlString,
    }, (err,info)=>{
        if(err){
            console.log('error in sending mail',err);
        }

        console.log('Message sent',info);
        return;
    });
}