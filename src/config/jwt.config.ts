import { registerAs } from '@nestjs/config';
//registrado en el modulo de configuracion personalizada de nest
export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    audience: process.env.JWT_TOKEN_AUDIENCE,
    issuer: process.env.JWT_TOKEN_ISSUER,
    accesTokenTtl: parseInt(process.env.JWT_ACCES_TOKEN_TTL ?? '3600', 10),
  };
});
