import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseIntOrUndefinedPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): number | null {
    const valueToNumber = parseInt(value);

    if (value !== undefined && isNaN(valueToNumber)) {
      throw new BadRequestException('숫자만 입력할 수 있습니다.');
    }

    return value ? valueToNumber : undefined;
  }
}
