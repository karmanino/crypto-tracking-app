export interface BinanceResponse {
    code:          string;
    message:       null;
    messageDetail: null;
    data:          Datum[];
    total:         number;
    success:       boolean;
  }
  
  export interface Datum {
    adv:        Adv;
    advertiser: Advertiser;
  }
  
  export interface Adv {
    advNo:                           string;
    classify:                        string;
    tradeType:                       string;
    asset:                           string;
    fiatUnit:                        string;
    advStatus:                       null;
    priceType:                       null;
    priceFloatingRatio:              null;
    rateFloatingRatio:               null;
    currencyRate:                    null;
    price:                           string;
    initAmount:                      string;
    surplusAmount:                   string;
    amountAfterEditing:              string;
    maxSingleTransAmount:            string;
    minSingleTransAmount:            string;
    buyerKycLimit:                   null;
    buyerRegDaysLimit:               null;
    buyerBtcPositionLimit:           null;
    remarks:                         null;
    autoReplyMsg:                    string;
    payTimeLimit:                    number;
    tradeMethods:                    TradeMethod[];
    userTradeCountFilterTime:        null;
    userBuyTradeCountMin:            null;
    userBuyTradeCountMax:            null;
    userSellTradeCountMin:           null;
    userSellTradeCountMax:           null;
    userAllTradeCountMin:            null;
    userAllTradeCountMax:            null;
    userTradeCompleteRateFilterTime: null;
    userTradeCompleteCountMin:       null;
    userTradeCompleteRateMin:        null;
    userTradeVolumeFilterTime:       null;
    userTradeType:                   null;
    userTradeVolumeMin:              null;
    userTradeVolumeMax:              null;
    userTradeVolumeAsset:            null;
    createTime:                      null;
    advUpdateTime:                   null;
    fiatVo:                          null;
    assetVo:                         null;
    advVisibleRet:                   null;
    assetLogo:                       null;
    assetScale:                      number;
    fiatScale:                       number;
    priceScale:                      number;
    fiatSymbol:                      string;
    isTradable:                      boolean;
    dynamicMaxSingleTransAmount:     string;
    minSingleTransQuantity:          string;
    maxSingleTransQuantity:          string;
    dynamicMaxSingleTransQuantity:   string;
    tradableQuantity:                string;
    commissionRate:                  string;
    tradeMethodCommissionRates:      any[];
    launchCountry:                   null;
    abnormalStatusList:              null;
  }
  
  export interface TradeMethod {
    payId:                null;
    payMethodId:          string;
    payType:              string;
    payAccount:           null;
    payBank:              null;
    paySubBank:           null;
    identifier:           string;
    iconUrlColor:         string;
    tradeMethodName:      string;
    tradeMethodShortName: null;
    tradeMethodBgColor:   string;
  }
  
  export interface Advertiser {
    userNo:           string;
    realName:         null;
    nickName:         string;
    margin:           null;
    marginUnit:       null;
    orderCount:       null;
    monthOrderCount:  number;
    monthFinishRate:  number;
    advConfirmTime:   number;
    email:            null;
    registrationTime: null;
    mobile:           null;
    userType:         string;
    tagIconUrls:      any[];
    userGrade:        number;
    userIdentity:     string;
    proMerchant:      null;
    isBlocked:        null;
  }

  export interface Subscriptor {
    _id:            ID;
    endpoint:       string;
    expirationTime: null;
    keys:           Keys;
}

export interface ID {
    $oid: string;
}

export interface Keys {
    p256dh: string;
    auth:   string;
}

export interface APIResponse {
  [key: string]:            any;
  "0"?:                      The0_Class;
  "1"?:                      The1;
  "2"?:                      The0_Class;
  "3"?:                      The0_Class;
  "4"?:                      The0_Class;
  "5"?:                      The1;
  "6"?:                      The1;
  "7"?:                      The0_Class;
  "8"?:                      The1;
  "9"?:                      The0_Class;
  "10"?:                     The1;
  "11"?:                     The0_Class;
  "12"?:                     The0_Class;
  "13"?:                     The1;
  "14"?:                     The1;
  "15"?:                     The0_Class;
  "16"?:                     The0_Class;
  "17"?:                     The0_Class;
  "18"?:                     The1;
  "19"?:                     The0_Class;
  maxPrice?:                 number;
  minPrice?:                 number;
  weighedPrice?:             number;
  totalAvailableForTrading?: number;
}

export interface The0_Class {
  paymentMethods?: PaymentMethods;
  amount?:         string;
  price?:          string;
}

export interface PaymentMethods {
  "0"?: The0_Enum;
}

export enum The0_Enum {
  BancoBrubankNew = "BancoBrubankNew",
  LemonCash = "LemonCash",
  MercadoPagoNew = "MercadoPagoNew",
}

export interface The1 {
  paymentMethods?: { [key: string]: string };
  amount?:         string;
  price?:          string;
}
