/* eslint-disable prettier/prettier */
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class UUIDValidationPipe implements PipeTransform<string> {
  transform(value: string): string {
    const isValidUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        value,
      );

    if (!isValidUUID) {
      throw new BadRequestException('ID debe ser un UUID válido');
    }

    return value;
  }
}
