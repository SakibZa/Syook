const crypto = require("crypto");
const WebSocket = require("ws");
const passwordKey = "Sakib_Husain_Zaidi";
const sha256=require('sha256');
const generateData = () => {
  const names = ["Jack Reacher", "John Wick", "James Bond", "Jason Bourne"];
  const origins = ["Bengaluru", "Mumbai", "Delhi", "Chennai"];
  const destinations = ["New York", "London", "Tokyo", "Sydney"];

  const data = [];
 

    const dataDict = {
      name: names,
      origin: origins,
      destination: destinations,
      secretKey: sha256((names + origins + destinations).toString()),
      secretKey:crypto.digest("hex")
    };

    data.push(dataDict);
    console.log(data);
    return data;
  }



const encryptData = (data, passwordKey) => {
  const cipher = crypto.createCipheriv("aes-256-ctr", passwordKey, new Buffer("0", "hex"));

  const encryptedData = [];
  for (const dataDict of data) {
    const payload = JSON.stringify(dataDict).toString();
    const encryptedPayload = cipher.update(payload);
    const finalEncryptedPayload = cipher.final();
    encryptedData.push(finalEncryptedPayload);
  }

  return encryptedData.join("|");
};

const sendData = (ws, data) => {
  ws.send(data);
};

const main = async () => {
  const passwordKey = "this_is_a_secret_key";
  const data = generateData();
  const encryptedData = encryptData(data, passwordKey);

  const ws = new WebSocket("ws://localhost:8080");

  while (true) {
    sendData(ws, encryptedData);
    await sleep(10000);
  }
};

main();

