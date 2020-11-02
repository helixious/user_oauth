require('dotenv').config();
// import Minio from 'minio';
const Minio = require('minio');

const {MINIO_HOST, MINIO_PORT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY} = process.env;

const minioClient = new Minio.Client({
    endPoint: MINIO_HOST,
    port: Number(MINIO_PORT),
    accessKey: MINIO_ACCESS_KEY,
    secretKey: MINIO_SECRET_KEY,
    // region: 'us-west-1',
    useSSL: false
});

const listBuckets = (req, res, next) => {
    minioClient.listBuckets((err, buckets) => {
        console.log(err);
        if(err) return res.sendStatus(500);
        return res.json(buckets);
    });
}


module.exports = {
    listBuckets
}