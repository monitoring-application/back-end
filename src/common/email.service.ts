import { OnEvent } from "@nestjs/event-emitter"
import { ContactUs } from "src/contact-us/entities/contact-us.entity"
import * as  mail from '@sendgrid/mail'


export class EmailService {

    @OnEvent('email.sent', { async: true })
    EmailSent(payload: ContactUs) {
        mail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
            to: payload.email,
            from: 'responsivcodetechnology@gmail.com',
            subject: 'ResponsivCode Feedback!',
            pre_header: '',
            text: 'text1',
            html: 'txt2',
            dynamic_template_data: {
                last_name: payload.last_name,
                first_name: payload.first_name,
            },
            template_id: 'd-31918a892cef4c07940f96f6c298fdfa'
        }
        mail.send(msg).then((e) => {

        }).catch((error) => {
        })
    }
}