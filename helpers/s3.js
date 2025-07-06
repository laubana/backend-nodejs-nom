const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const uuid = require("uuid").v4;

exports.s3UploadV3 = async (files) => {
  const s3Client = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const params = files.map((file) => {
    const key = `uploads/${uuid()}-${file.originalname}`;
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      _key: key,
    };
  });

  const results = await Promise.all(
    params.map((param) => s3Client.send(new PutObjectCommand(param)))
  );

  return results.map((result, index) => ({
    ...result,
    Key: process.env.AWS_S3_UPLOAD_URL + params[index]._key,
  }));
};
