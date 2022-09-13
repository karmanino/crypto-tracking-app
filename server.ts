import { APIResponse, BinanceResponse, Subscriptor } from "./interfaces";

const path = require("path");
const express = require("express");
const webpush = require("web-push");
const https = require("https");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
app.listen(process.env.PORT || 3001);
webpush.setVapidDetails(
  "mailto:juan@delacalle.com",
  process.env.PUBLIC_KEY,
  process.env.PRIVATE_KEY
);

async function getAllSubscriptors(): Promise<Subscriptor[]> {
  return new Promise((resolve, reject) => {
    const uri =
      "mongodb+srv://karmanino:IsV4HYohdfzQpiN9@micluster.febhy.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
    client.connect(async (err: any) => {
      const collection = await client
        .db("miBaseDatos")
        .collection("subsciptors");
      const allSubscriptions = await collection.find().toArray();
      console.log("Total subscriptions", allSubscriptions.length);
      client.close();
      resolve(allSubscriptions);
    });
  });
}

app.get("/api/notify", async (req: any, res: any) => {
  await getAllSubscriptors().then((allSubscriptions: Subscriptor[]) => {
    getP2PMarketData().then((data: any) => {
      const now = new Date();
      let errorJsons = "";
      let time = `${now.getDate()}/${
        now.getMonth() + 1
      }/${now.getFullYear()} ${now.toLocaleTimeString("en-US", {
        timeZone: "America/Argentina/Salta",
      })}`;
      Promise.all(
        allSubscriptions.map((sub) =>
          webpush.sendNotification(
            sub,
            `{"notification":{
            "title":"Binance P2P Report @ ${time}",
            "body":"Min $${data["minPrice"]} | Avg: $${data["weighedPrice"]} | Max $${data["maxPrice"]} | Offered ${data["totalAvailableForTrading"]} USDT",
            "icon":"https://img.freepik.com/vector-premium/logotipo-cryptocurrency-ethereum-e-ilustracion-icono-vector-plano_602177-33.jpg",
            "image":"https://img.freepik.com/vector-premium/logotipo-cryptocurrency-ethereum-e-ilustracion-icono-vector-plano_602177-33.jpg"
          }}`
          )
        )
      )
        .then((z) => {
          console.log("[SENT]", z);
        })
        .catch((err) => {
          errorJsons += JSON.stringify(err);
          console.error("Error sending notification, reason: ", err);
        })
        .finally(() => res.json({ message: errorJsons, status: 200 }));
    });
  });
  return res;
});

app.use(express.json());

app.post("/api/subscribe", (outsideReq: any, outsideRes: any) => {
  console.log("[inserting]", outsideReq.body.endpoint);
  const uri =
    "mongodb+srv://karmanino:IsV4HYohdfzQpiN9@micluster.febhy.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
  client.connect(async (err: any) => {
    const collection = await client.db("miBaseDatos").collection("subsciptors");
    let exists = await collection.findOne({
      endpoint: outsideReq.body.endpoint,
    });
    if (exists) {
      outsideRes.status(207).send();
      console.log("[ERROR - already registered]", outsideReq.body.endpoint);
    } else {
      await collection.insertOne({ ...outsideReq.body }, (error: any) => {
        if (error) {
          console.log("[ERROR - inserting to db]", error);
          outsideRes.status(401).send();
        } else {
          console.log("[SUCESSFULL]");
          outsideRes.status(204).send();
        }
      });
      //client.close();
    }
  });
});

app.get("/api/p2p", (req: any, res: any) =>
  getP2PMarketData().then((data) => res.send(data))
);

app.post("/api/p2p", (req: any, res: any) =>
  getP2PMarketData(JSON.stringify(req.body)).then((data) => res.send(data))
);

app.get("/", function (req: any, res: any) {
  app.use(express.static(__dirname + "/app/dist/crypto-tracking-app"));
  res.sendFile(
    path.join(__dirname + "/app/dist/crypto-tracking-app/index.html")
  );
});

async function getP2PMarketData(customData?: any) { 
  return new Promise((resolve, reject) => { 
    console.log(process.env.PRIVATE_KEY);
    const stringData = customData
      ? customData
      : `{"page":1,"rows":20,"payTypes":["BANK","Beloapp","MercadoPagoNew","BancoBrubankNew","UalaNew", "BankArgentina","Reba","LemonCash","Prex","BancoDelSol"],"countries":[],"publisherType":null,"fiat":"ARS","tradeType":"BUY","asset":"USDT","merchantCheck":false}`;
      const options = {
      hostname: "p2p.binance.com",
      port: 443,
      path: "/bapi/c2c/v2/friendly/c2c/adv/search",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": stringData.length,
      },
    };
    const req = https.request(options, (res: any) => {
      let output = "";

      res.on("data", (d: any) => {
        output += d;
      });

      res.on("end", () => {
        let date = new Date();
        console.log("[request] @ ", date.toLocaleDateString(), date.toLocaleTimeString())
        try {
          let paymentTypes: APIResponse = {};
          let pricesArray = new Array();
          let totalAvailableForTrading = 0;
          let respuesta: BinanceResponse = JSON.parse(output);
          if (respuesta.success === true && respuesta?.data.length > 0) {
            respuesta.data.forEach((val, idx2) => {
              paymentTypes[idx2] = {};
              paymentTypes[idx2]["paymentMethods"] = {};
              paymentTypes[idx2]["amount"] = val.adv.tradableQuantity;
              paymentTypes[idx2]["price"] = val.adv.price;
              totalAvailableForTrading += Number.parseFloat(
                val.adv.tradableQuantity
              );
              pricesArray.push([val.adv.tradableQuantity, val.adv.price]);
              val.adv.tradeMethods.forEach((val, idx) => {
                paymentTypes[idx2]["paymentMethods"][idx] = val.identifier;
              });
            });
            let weighedPrice = 0;
            pricesArray.forEach(
              (val) =>
                (weighedPrice += (val[0] / totalAvailableForTrading) * val[1])
            );
            console.log("[minPrice]", paymentTypes[0]!["price"]);
            console.log(
              "[maxPrice]",
              paymentTypes[Object.keys(paymentTypes).length - 1]["price"]
            );
            console.log("[weighedPrice]", weighedPrice);
            console.log("[totalAvailableForTrading]", totalAvailableForTrading);
            paymentTypes["maxPrice"] = Number.parseFloat(
              paymentTypes[Object.keys(paymentTypes).length - 1]["price"]
            );
            paymentTypes["minPrice"] = Number.parseFloat(
              paymentTypes[0]!["price"]!
            );
            paymentTypes["weighedPrice"] = Number.parseFloat(
              weighedPrice.toFixed(2)
            );
            paymentTypes["totalAvailableForTrading"] = Number.parseFloat(
              totalAvailableForTrading.toFixed(2)
            );
            resolve(paymentTypes);
          } else {
            resolve("Binance API request error");
          }
        } catch (e) {
          console.log(e);
          reject(e);
        }
      });
    });
    req.on("error", (error: any) => {
      console.log(error);
    });

    req.write(stringData);
    req.end();
  });
}
