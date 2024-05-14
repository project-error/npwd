import fetch, { FormData } from 'node-fetch';
import { config } from '@npwd/config/server';
import { Player } from '../players/player.class';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { uuidv4 } from '../../utils/fivem';

export async function tweetDiscordPost(url: string, body: string): Promise<any> {
  return new Promise((resolve, reject) =>
    fetch(url, {
      method: 'POST',
      body,
      headers: {
        ['Content-Type']: 'application/json',
      },
    })
      .then(async (res) => {
        const response: any = await res.json();
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      }),
  );
}

export async function r2PhotoUpload(body: string | FormData, token: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const client = new S3Client({
      region: "auto",
      endpoint: config.images.r2.endpoint,
      credentials: {
          accessKeyId: config.images.r2.credentials.accessKeyId,
          secretAccessKey: config.images.r2.credentials.secretAccessKey
      }
    });
    const key = `${uuidv4()}.${config.images.imageEncoding}`;
    const command = new PutObjectCommand({
      Bucket: config.images.r2.bucketName,
      Key: key,
      Body: body,
      ContentType: "image/" + config.images.imageEncoding
    });
    const response = await client.send(command);
    resolve(`${config.images.url}${key}`); 
  });
}


export async function apiPhotoUpload(body: string | FormData, token: string): Promise<any> {
  return new Promise((resolve, reject) =>
    fetch(config.images.url, {
      method: 'POST',
      body,
      headers: {
        [config.images.useAuthorization &&
        config.images.authorizationHeader]: `${config.images.authorizationPrefix} ${token}`,
        [config.images.useContentType && 'Content-Type']: config.images.contentType,
      },
    }).then(async (result) => {
      if (result.status !== 200) {
        const err = await result.text();
        reject({ errorText: err, statusCode: result.status });
      }

      const res = await result.json();
      resolve(res);
    }),
  );
}

export async function webhookPhotoUpload(
  webhook: string,
  imagePath: string,
  blob: any,
  player: Player,
): Promise<string> {
  const form: FormData = new FormData();

  form.append('file0', blob, `fivemscreenshot.${config.images.imageEncoding}`);

  form.append(
    'payload_json',
    JSON.stringify({
      content: `**NPWD:** Image uploaded by ${player.getIdentifier()}`,
    }),
  );

  return new Promise((resolve, reject) =>
    fetch(webhook, {
      method: 'POST',
      body: form,
    })
      .then(async (res) => {
        // fuck discord, not my fault I am using any here
        const response: any = await res.json();
        resolve(response.attachments[0].proxy_url);
      })
      .catch((err) => {
        reject(err);
      }),
  );
}
