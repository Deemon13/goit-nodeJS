import multer from 'multer';
import path from 'path';
import imagemin from 'imagemin';
import { promises as fsPromises } from 'fs';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';

import { avatar } from '../helpers/createAvatarIcon';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UNCOMPRESSED_IMAGES_FOLDER);
  },
  filename: function (req, file, cb) {
    const { ext } = path.parse(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

export async function compressImage(req, res, next) {
  if (!req.file) {
    next();
  }

  const { path: uncompressedFilePath, filename } = req.file;
  const COMPRESSING_DESTINATING = process.env.COMPRESSED_IMAGES_FOLDER; //puplic/images
  const UNCOMPRESSED_IMAGES_FOLDER = process.env.UNCOMPRESSED_IMAGES_FOLDER; //tmp

  await imagemin([`${UNCOMPRESSED_IMAGES_FOLDER}/${filename}`], {
    destination: COMPRESSING_DESTINATION,
    plugins: [imageminJpegtran(), imageminPngquant({ quality: [0.6, 0.8] })],
  });

  req.file.path = path.join(COMPRESSING_DESTINATING, filename);

  await fsPromises.unlink(uncompressedFilePath);

  next();
}

export async function generateAvatarIcon(req, res, next) {
  const contactAvatar = await avatar.create();
  const avatarName = `avatar-${Date.now()}.png`;
  const avatarPath = path.join(__dirname, `./../../tmp/${avatarName}`);
  await fsPromises.writeFile(avatarPath, contactAvatar);

  const COMPRESSING_DESTINATING = process.env.COMPRESSED_IMAGES_FOLDER; //puplic/images
  const UNCOMPRESSED_IMAGES_FOLDER = process.env.UNCOMPRESSED_IMAGES_FOLDER; //tmp

  await imagemin([`${UNCOMPRESSED_IMAGES_FOLDER}/${avatarName}`], {
    destination: COMPRESSING_DESTINATING,
    plugins: [imageminJpegtran(), imageminPngquant({ quality: [0.6, 0.8] })],
  });

  req.file = path.join(avatarName);

  await fsPromises.unlink(`${UNCOMPRESSED_IMAGES_FOLDER}/${avatarName}`);

  next();
}

export const upload = multer({ storage }, compressImage, generateAvatarIcon);
