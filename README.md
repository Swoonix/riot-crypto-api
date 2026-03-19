# Crypto API

HTTP API for encrypting, decrypting, signing, and verifying JSON payloads. This is a take home test for RIOT.

## Stack

- **NestJS** — framework
- **Base64** — encryption algorithm
- **HMAC-SHA256** — signing algorithm
- **fast-json-stable-stringify** - library to canonicalize JSON because order of properties should not affect the signature (JSON.stringify is not enough)

## Getting started

```bash
npm install
npm run start:dev
```

The server runs on `http://localhost:3000` by default.

### Environment variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port the server listens on | `3000` |
| `HMAC_SECRET` | Secret key used for signing | `default-secret` |

## Swagger

Interactive API documentation is available at:

```
http://localhost:3000/api-docs
```

Feel free to test endpoints through Swagger.

## Endpoints

### `POST /encrypt`

Encrypts all properties at depth 1 of a JSON payload using Base64. Nested objects are serialized before encryption.

**Request**
```json
{
  "name": "John Doe",
  "age": 30,
  "contact": { "email": "john@example.com", "phone": "123-456-7890" }
}
```

**Response** `201`
```json
{
  "name": "SUpvaG4gRG9lIg==",
  "age": "MzA=",
  "contact": "eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJwaG9uZSI6IjEyMy00NTYtNzg5MCJ9"
}
```

---

### `POST /decrypt`

Decrypts Base64-encoded values. Properties that are not valid Base64-encoded JSON are left unchanged.

**Request**
```json
{
  "name": "SUpvaG4gRG9lIg==",
  "age": "MzA=",
  "contact": "eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJwaG9uZSI6IjEyMy00NTYtNzg5MCJ9",
  "birth_date": "1998-11-19"
}
```

**Response** `201`
```json
{
  "name": "John Doe",
  "age": 30,
  "contact": { "email": "john@example.com", "phone": "123-456-7890" },
  "birth_date": "1998-11-19"
}
```

---

### `POST /sign`

Computes an HMAC-SHA256 signature of the payload. Property order does not affect the signature.

**Request**
```json
{
  "message": "Hello World",
  "timestamp": 1616161616
}
```

**Response** `201`
```json
{
  "signature": "a1b2c3d4e5f6..."
}
```

---

### `POST /verify`

Verifies a signature against a payload.

**Request**
```json
{
  "signature": "a1b2c3d4e5f6...",
  "data": {
    "message": "Hello World",
    "timestamp": 1616161616
  }
}
```

**Response**
- `204` — signature is valid
- `400` — signature is invalid

## Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e
````

## Improvements

Some improvements could be added : 
- Add a `success` / `reject` pattern on `UseCases` to avoid checking result in Controller
- Add an `InvalidSignatureException` domain exception class to avoid having business logic in Controller

## Algorithm Abstraction

We can easily switch from an algorithm to another one just by switching the factory used in `crypto.module.ts`

```typescript
  {
      provide: ENCRYPTION_SERVICE,
      useClass: Base64EncryptionService,
  },
```
could be : 

```typescript
  {
      provide: ENCRYPTION_SERVICE,
      useClass: Base32EncryptionService,
  },
```

to use a Base32 algorithm matching the `EncryptionService` interface. 

## Consistency

Both `/encpryt` followed by `/decrypt` and `/sign` followed by `/verify` workflows are tested in `app.e2e-spec.ts`. You can use the swagger to verify it as well. 