import AWS from 'aws-sdk';

const bucketArn = 'fishpic-images';

export const deleteImage = async (key) => {
  var s3 = new AWS.S3({apiVersion: '2006-03-01'});
  var params = {
    Bucket: bucketArn,
    Key: key
  };
  console.log(`Deleting S3 object: ${key}.`);
  return await s3.deleteObject(params).promise();
}