"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var path = require("path");
var express = require("express");
var webpush = require("web-push");
var https = require("https");
var _a = require("mongodb"), MongoClient = _a.MongoClient, ServerApiVersion = _a.ServerApiVersion;
var app = express();
app.listen(process.env.PORT || 3001);
webpush.setVapidDetails("mailto:juan@delacalle.com", process.env.PUBLIC_KEY, process.env.PRIVATE_KEY);
function getAllSubscriptors() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var uri = "mongodb+srv://karmanino:IsV4HYohdfzQpiN9@micluster.febhy.mongodb.net/?retryWrites=true&w=majority";
                    var client = new MongoClient(uri, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                        serverApi: ServerApiVersion.v1
                    });
                    client.connect(function (err) { return __awaiter(_this, void 0, void 0, function () {
                        var collection, allSubscriptions;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, client
                                        .db("miBaseDatos")
                                        .collection("subsciptors")];
                                case 1:
                                    collection = _a.sent();
                                    return [4 /*yield*/, collection.find().toArray()];
                                case 2:
                                    allSubscriptions = _a.sent();
                                    console.log("Total subscriptions", allSubscriptions.length);
                                    client.close();
                                    resolve(allSubscriptions);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                })];
        });
    });
}
app.get("/api/notify", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getAllSubscriptors().then(function (allSubscriptions) {
                    getP2PMarketData().then(function (data) {
                        var now = new Date();
                        var errorJsons = "";
                        var time = "".concat(now.getDate(), "/").concat(now.getMonth() + 1, "/").concat(now.getFullYear(), " ").concat(now.toLocaleTimeString("en-US", {
                            timeZone: "America/Argentina/Salta"
                        }));
                        Promise.all(allSubscriptions.map(function (sub) {
                            return webpush.sendNotification(sub, "{\"notification\":{\n            \"title\":\"Binance P2P Report @ ".concat(time, "\",\n            \"body\":\"Min $").concat(data["minPrice"], " | Avg: $").concat(data["weighedPrice"], " | Max $").concat(data["maxPrice"], " | Offered ").concat(data["totalAvailableForTrading"], " USDT\",\n            \"icon\":\"https://img.freepik.com/vector-premium/logotipo-cryptocurrency-ethereum-e-ilustracion-icono-vector-plano_602177-33.jpg\",\n            \"image\":\"https://img.freepik.com/vector-premium/logotipo-cryptocurrency-ethereum-e-ilustracion-icono-vector-plano_602177-33.jpg\"\n          }}"));
                        }))
                            .then(function (z) {
                            console.log("[SENT]", z);
                        })["catch"](function (err) {
                            errorJsons += JSON.stringify(err);
                            console.error("Error sending notification, reason: ", err);
                        })["finally"](function () { return res.json({ message: errorJsons, status: 200 }); });
                    });
                })];
            case 1:
                _a.sent();
                return [2 /*return*/, res];
        }
    });
}); });
app.use(express.json());
app.post("/api/subscribe", function (outsideReq, outsideRes) {
    console.log("[inserting]", outsideReq.body.endpoint);
    var uri = "mongodb+srv://karmanino:IsV4HYohdfzQpiN9@micluster.febhy.mongodb.net/?retryWrites=true&w=majority";
    var client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1
    });
    client.connect(function (err) { return __awaiter(void 0, void 0, void 0, function () {
        var collection, exists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.db("miBaseDatos").collection("subsciptors")];
                case 1:
                    collection = _a.sent();
                    return [4 /*yield*/, collection.findOne({
                            endpoint: outsideReq.body.endpoint
                        })];
                case 2:
                    exists = _a.sent();
                    if (!exists) return [3 /*break*/, 3];
                    outsideRes.status(207).send();
                    console.log("[ERROR - already registered]", outsideReq.body.endpoint);
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, collection.insertOne(__assign({}, outsideReq.body), function (error) {
                        if (error) {
                            console.log("[ERROR - inserting to db]", error);
                            outsideRes.status(401).send();
                        }
                        else {
                            console.log("[SUCESSFULL]");
                            outsideRes.status(204).send();
                        }
                    })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    }); });
});
app.get("/api/p2p", function (req, res) {
    return getP2PMarketData().then(function (data) { return res.send(data); });
});
app.post("/api/p2p", function (req, res) {
    return getP2PMarketData(JSON.stringify(req.body)).then(function (data) { return res.send(data); });
});
app.get("/", function (req, res) {
    app.use(express.static(__dirname + "/app/dist/crypto-tracking-app"));
    res.sendFile(path.join(__dirname + "/app/dist/crypto-tracking-app/index.html"));
});
function getP2PMarketData(customData) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    console.log(process.env.PRIVATE_KEY);
                    var stringData = customData
                        ? customData
                        : "{\"page\":1,\"rows\":20,\"payTypes\":[\"BANK\",\"Beloapp\",\"MercadoPagoNew\",\"BancoBrubankNew\",\"UalaNew\", \"BankArgentina\",\"Reba\",\"LemonCash\",\"Prex\",\"BancoDelSol\"],\"countries\":[],\"publisherType\":null,\"fiat\":\"ARS\",\"tradeType\":\"BUY\",\"asset\":\"USDT\",\"merchantCheck\":false}";
                    var options = {
                        hostname: "p2p.binance.com",
                        port: 443,
                        path: "/bapi/c2c/v2/friendly/c2c/adv/search",
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Content-Length": stringData.length
                        }
                    };
                    var req = https.request(options, function (res) {
                        var output = "";
                        res.on("data", function (d) {
                            output += d;
                        });
                        res.on("end", function () {
                            var date = new Date();
                            console.log("[request] @ ", date.toLocaleDateString(), date.toLocaleTimeString());
                            try {
                                var paymentTypes_1 = {};
                                var pricesArray_1 = new Array();
                                var totalAvailableForTrading_1 = 0;
                                var respuesta = JSON.parse(output);
                                if (respuesta.success === true && (respuesta === null || respuesta === void 0 ? void 0 : respuesta.data.length) > 0) {
                                    respuesta.data.forEach(function (val, idx2) {
                                        paymentTypes_1[idx2] = {};
                                        paymentTypes_1[idx2]["paymentMethods"] = {};
                                        paymentTypes_1[idx2]["amount"] = val.adv.tradableQuantity;
                                        paymentTypes_1[idx2]["price"] = val.adv.price;
                                        totalAvailableForTrading_1 += Number.parseFloat(val.adv.tradableQuantity);
                                        pricesArray_1.push([val.adv.tradableQuantity, val.adv.price]);
                                        val.adv.tradeMethods.forEach(function (val, idx) {
                                            paymentTypes_1[idx2]["paymentMethods"][idx] = val.identifier;
                                        });
                                    });
                                    var weighedPrice_1 = 0;
                                    pricesArray_1.forEach(function (val) {
                                        return (weighedPrice_1 += (val[0] / totalAvailableForTrading_1) * val[1]);
                                    });
                                    console.log("[minPrice]", paymentTypes_1[0]["price"]);
                                    console.log("[maxPrice]", paymentTypes_1[Object.keys(paymentTypes_1).length - 1]["price"]);
                                    console.log("[weighedPrice]", weighedPrice_1);
                                    console.log("[totalAvailableForTrading]", totalAvailableForTrading_1);
                                    paymentTypes_1["maxPrice"] = Number.parseFloat(paymentTypes_1[Object.keys(paymentTypes_1).length - 1]["price"]);
                                    paymentTypes_1["minPrice"] = Number.parseFloat(paymentTypes_1[0]["price"]);
                                    paymentTypes_1["weighedPrice"] = Number.parseFloat(weighedPrice_1.toFixed(2));
                                    paymentTypes_1["totalAvailableForTrading"] = Number.parseFloat(totalAvailableForTrading_1.toFixed(2));
                                    resolve(paymentTypes_1);
                                }
                                else {
                                    resolve("Binance API request error");
                                }
                            }
                            catch (e) {
                                console.log(e);
                                reject(e);
                            }
                        });
                    });
                    req.on("error", function (error) {
                        console.log(error);
                    });
                    req.write(stringData);
                    req.end();
                })];
        });
    });
}
