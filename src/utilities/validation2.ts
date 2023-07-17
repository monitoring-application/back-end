import { ArgumentMetadata, BadRequestException, HttpException, HttpStatus, UnprocessableEntityException, ValidationPipe } from "@nestjs/common"

export class ValidationPipe422 extends ValidationPipe {
    public async transform(value, metadata: ArgumentMetadata) {
        try {
            return await super.transform(value, metadata)
        } catch (e) {
            if (e as BadRequestException) {
                throw new HttpException(e.message.message, HttpStatus.BAD_REQUEST)
            }
        }
    }
}