import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VerifyDto } from './dto/verify.dto';

export const ApiEncrypt = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Encrypt a JSON payload',
      description:
        'Encrypts all properties at depth 1 using Base64. Nested objects are serialized and encrypted as a single value.',
    }),
    ApiBody({
      schema: {
        example: {
          name: 'John Doe',
          age: 30,
          contact: { email: 'john@example.com', phone: '123-456-7890' },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Encrypted payload',
      schema: {
        example: {
          name: 'SUpvaG4gRG9lIg==',
          age: 'MzA=',
          contact:
            'eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJwaG9uZSI6IjEyMy00NTYtNzg5MCJ9',
        },
      },
    }),
  );

export const ApiDecrypt = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Decrypt a JSON payload',
      description:
        'Decrypts Base64-encoded values. Properties that are not valid Base64-encoded JSON are left unchanged.',
    }),
    ApiBody({
      schema: {
        example: {
          name: 'SUpvaG4gRG9lIg==',
          age: 'MzA=',
          contact:
            'eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJwaG9uZSI6IjEyMy00NTYtNzg5MCJ9',
          birth_date: '1998-11-19',
        },
      },
    }),
    ApiResponse({
      status: 201,
      description:
        'Decrypted payload. Unencrypted properties are returned unchanged.',
      schema: {
        example: {
          name: 'John Doe',
          age: 30,
          contact: { email: 'john@example.com', phone: '123-456-7890' },
          birth_date: '1998-11-19',
        },
      },
    }),
  );

export const ApiSign = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Sign a JSON payload',
      description:
        'Computes an HMAC-SHA256 signature of the payload. Property order does not affect the signature.',
    }),
    ApiBody({
      schema: { example: { message: 'Hello World', timestamp: 1616161616 } },
    }),
    ApiResponse({
      status: 201,
      description: 'HMAC signature of the payload',
      schema: { example: { signature: 'a1b2c3d4e5f6g7h8i9j0...' } },
    }),
  );

export const ApiVerify = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Verify a signed payload',
      description:
        'Verifies that the provided signature matches the data. Property order does not affect the result.',
    }),
    ApiBody({ type: VerifyDto }),
    ApiResponse({ status: 204, description: 'Signature is valid' }),
    ApiResponse({ status: 400, description: 'Signature is invalid' }),
  );
