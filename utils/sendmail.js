const nodemailer=require('nodemailer');

const mailsender=(maillist,subject,body)=>{
    console.log("Testing");
    const transporter=nodemailer.createTransport({
        service:'hotmail',
        auth:{
            user:"sarodemayur55@outlook.com",
            pass:"Mayur@1310"
        }
    });
  
    const options={
        from:"sarodemayur55@outlook.com",
        to:maillist,
        subject:subject,
        text:body
    }
    transporter.sendMail(options,(err,info)=>{
        if(err)
        {
            console.log(err);
            return;
        }
        // console.log(info);
    })
}
module.exports=mailsender