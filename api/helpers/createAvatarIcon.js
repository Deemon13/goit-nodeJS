import Avatar from 'avatar-builder';

export const avatar = Avatar.builder(
  Avatar.Image.margin(Avatar.Image.circleMask(Avatar.Image.identicon())),
  128,
  128,
);
