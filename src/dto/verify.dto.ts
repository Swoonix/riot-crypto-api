import { ApiProperty } from '@nestjs/swagger';

export class VerifyDto {
  @ApiProperty({ example: 'a1b2c3d4e5f6...' })
  signature: string;

  @ApiProperty({
    example: { message: 'Hello World', timestamp: 1616161616 },
    description: 'The original payload that was signed',
  })
  data: Record<string, unknown>;
}
