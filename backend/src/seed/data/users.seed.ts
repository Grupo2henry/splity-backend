/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
// src/seed/data/users.seed.ts

export const usersSeed = [
  {
    name: 'Gonzalo',
    email: 'gonzalo@example.com',
    username: 'gonzalo123',
    password: '123456', // idealmente hasheado si vas a usar auth real
    is_premium: false,
    active: true,
    created_at: new Date(),
  },
  {
    name: 'Nico',
    email: 'nico@example.com',
    username: 'nico_dev',
    password: '123456',
    is_premium: false,
    active: true,
    created_at: new Date(),
  },
  {
    name: 'Laura',
    email: 'laura@example.com',
    username: 'laurita_88',
    password: 'securePassword',
    is_premium: true,
    active: true,
    created_at: new Date(),
  },
  {
    name: 'Martín',
    email: 'martin@example.com',
    username: 'martin_g',
    password: 'mysecret',
    is_premium: false,
    active: true,
    created_at: new Date(),
  },
  {
    name: 'Sofía',
    email: 'sofia@example.com',
    username: 'sofi_code',
    password: 'anotherSecure',
    is_premium: false,
    active: true,
    created_at: new Date(),
  },
  {
    name: 'Javier',
    email: 'javier@example.com',
    username: 'javi_prog',
    password: 'complexPass',
    is_premium: true,
    active: true,
    created_at: new Date(),
  },
];