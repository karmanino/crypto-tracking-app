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
  