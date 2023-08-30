const crypto = require("crypto");
const WebSocket = require("ws");
const mongodb = require("mongodb");

const passwordKey = "Sakib_Husain_Zaidi";

const decryptData = (data, passwordKey) => {
  const cipher = crypto.createCipheriv("aes-256-ctr", passwordKey, new Buffer("0", "hex"));

  const decryptedData = [];
  for (const encryptedPayload of data.split("|")) {
    const encryptedPayload = Buffer.from(encryptedPayload, "base64");
    const decryptedPayload = cipher.update(encryptedPayload);
    const finalDecryptedPayload = cipher.final();
    decryptedData.push(JSON.parse(finalDecryptedPayload.toString()));
  }

  return decryptedData;
};

const validateData = (data) => {
  for (const dataDict of data) {
    const secretKey = crypto.sha256((dataDict.name + dataDict.origin + dataDict.destination).toString()).digest("hex");
    if (dataDict.secretKey != secretKey) {
      return false;
    }
  }

  return true;
};

const saveData = (data, db) => {
  for (const dataDict of data) {
    dataDict["timestamp"] = new Date().getTime();
    db.insertOne(dataDict);
  }
};

const main = async () => {
  const passwordKey = "Sakib_Husain_Zaidi";

  const ws = new WebSocket("https://localhost:8000");

  const db = await mongodb.MongoClient().connect("mongodb://localhost:27017/Data_Test");

  while (true) {
    const data = await ws.recv();
    const decryptedData = decryptData(data, passwordKey);

    if (validateData(decryptedData)) {
      saveData(decryptedData, db);
    }
}
}
