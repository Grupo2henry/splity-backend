/* eslint-disable prettier/prettier */
export const usersSeed = [
  /*dto
{
  "name": "Gonzalo",
  "email": "gonzalo@example.com",
  "username": "gonzalo123",
  "password": "123456",
  "confirm_password": "123456"
}
*/
  {
    name: 'Gonzalo',
    email: 'gonzalo@example.com',
    username: 'gonzalo123',
    password: 'Gonza1!',
    is_premium: false,
    active: true,
    created_at: new Date(),
    rol: 'admin',
  },
  {
    name: 'Nico',
    email: 'nico@example.com',
    username: 'nico_dev',
    password: 'NicoDev2#',
    is_premium: false,
    active: true,
    created_at: new Date(),
    rol: 'user',
  },
  {
    name: 'Laura',
    email: 'laura@example.com',
    username: 'laurita_88',
    password: 'LauraS3%',
    is_premium: true,
    active: true,
    created_at: new Date(),
    rol: 'user',
  },
  {
    name: 'Martín',
    email: 'martin@example.com',
    username: 'martin_g',
    password: 'MartinG4$',
    is_premium: false,
    active: true,
    created_at: new Date(),
    rol: 'user',
  },
  {
    name: 'Sofía',
    email: 'sofia@example.com',
    username: 'sofi_code',
    password: 'SofiaC5^',
    is_premium: false,
    active: true,
    created_at: new Date(),
    rol: 'user',
  },
  {
    name: 'Javier',
    email: 'javier@example.com',
    username: 'javi_prog',
    password: 'JavierP6&',
    is_premium: true,
    active: true,
    created_at: new Date(),
    rol: 'user',
  },
];