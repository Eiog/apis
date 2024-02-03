"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/worker.ts
var import_node_worker_threads = require("worker_threads");
var import_node_path = require("path");
var import_qiniu = __toESM(require("qiniu"));
var import_node_json_db = require("node-json-db");
var import_https_proxy_agent = require("https-proxy-agent");
var import_doydl = require("doydl");
var import_ytdl_core = require("ytdl-core");
var isDev = process.env.mode === "dev";
var db = new import_node_json_db.JsonDB(new import_node_json_db.Config((0, import_node_path.resolve)(__dirname, "json-db"), true, true, "/"));
var { accessKey, secretKey, bucket } = {
  accessKey: "RKErW4JfD83EmAKGxNe3ycXhklqxbpzVmDO7WMi5",
  secretKey: "Lr4P6QNNtm5krT3BUUBeqYcwT6X1TawjdonHqYcH",
  bucket: "video-download-temp"
};
var mac = new import_qiniu.default.auth.digest.Mac(accessKey, secretKey);
var putPolicy = new import_qiniu.default.rs.PutPolicy({ scope: bucket });
var uploadToken = putPolicy.uploadToken(mac);
var formUploader = new import_qiniu.default.form_up.FormUploader({ scope: bucket });
var putExtra = new import_qiniu.default.form_up.PutExtra();
var bucketManager = new import_qiniu.default.rs.BucketManager(mac);
var publicBucketDomain = "http://s89qdedec.bkt.gdipper.com";
var dataFromMainThread = import_node_worker_threads.workerData;
var eventMap = {
  douyin,
  youtube
};
function run({ event, data }) {
  if (eventMap[event])
    return eventMap[event](data);
  import_node_worker_threads.parentPort?.postMessage({ status: "error", msg: "event notfound" });
}
run(dataFromMainThread);
async function douyin({ url }) {
  try {
    const shortUrl = (0, import_doydl.getShortUrlByShareUrl)(url);
    const realUrl = await (0, import_doydl.getRealUrlByShortUrl)(shortUrl);
    const videoId = (0, import_doydl.getDouyinVideoIdByRealUrl)(realUrl);
    const path = `/douyin/${videoId}`;
    if (await db.exists(path)) {
      const dbRes = await db.getObject(path);
      return import_node_worker_threads.parentPort?.postMessage({ status: "success", data: JSON.stringify(dbRes) });
    }
    const info = await (0, import_doydl.getDouyinVideoDataByVideoId)(videoId);
    const stream = (0, import_doydl.downloadFromInfo)(info);
    await putOss(`douyin/${videoId}.mp4`, stream);
    const publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, `douyin/${videoId}.mp4`);
    const dbSaveData = { url, status: "success", id: (0, import_doydl.format)(info).vid, publicDownloadUrl, data: (0, import_doydl.format)(info) };
    await db.push(path, dbSaveData);
    import_node_worker_threads.parentPort?.postMessage({ status: "success", data: JSON.stringify(dbSaveData) });
  } catch (error) {
    import_node_worker_threads.parentPort?.postMessage({ status: "error", msg: JSON.stringify(error) });
  }
}
async function youtube({ url }) {
  try {
    const agent = isDev ? new import_https_proxy_agent.HttpsProxyAgent("http://127.0.0.1:7890") : void 0;
    const videoId = (0, import_ytdl_core.getURLVideoID)(url);
    const info = await (0, import_ytdl_core.getInfo)(url, { requestOptions: { agent } });
    const path = `/youtube/${videoId}`;
    const stream = (0, import_ytdl_core.downloadFromInfo)(info, { requestOptions: { agent } });
    await putOss(`youtube/${videoId}.mp4`, stream);
    const publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, `youtube/${videoId}.mp4`);
    const dbSaveData = { url, status: "success", id: videoId, publicDownloadUrl, data: info };
    await db.push(path, dbSaveData);
    import_node_worker_threads.parentPort?.postMessage({ status: "success", data: JSON.stringify(dbSaveData) });
  } catch (error) {
    import_node_worker_threads.parentPort?.postMessage({ status: "error", msg: JSON.stringify(error) });
  }
}
function putOss(path, stream) {
  return new Promise((resolve2, reject) => {
    formUploader.putStream(uploadToken, path, stream, putExtra, (respErr, respBody, respInfo) => {
      if (respErr)
        return reject(respErr);
      if (respInfo.statusCode === 200)
        return resolve2(respInfo);
      else
        return reject(respInfo);
    });
  });
}
