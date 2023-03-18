import * as dotenv from "dotenv"
import fetch from "node-fetch";
dotenv.config()

export default class FetchHandler {

    _myHeaders = new Headers();
    _requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: this._myHeaders
    };

    constructor() {
        this._myHeaders.append("apikey", process.env.ACTUAL_API_KEY);
    }
    /** 
    * Возвращает JSON ApiLayer курса валюты
    * @param {string} currency Запрашиваемая валлюта в формате "RUB"
    * @return {JSON}
    */
    async GetCurrencyBasedOn(currency) {
        return await fetch(`https://api.apilayer.com/exchangerates_data/latest?symbols=USD,EUR,JPY,GBP,AUD,CAD,CHF,CNY,SEK,MXN,NZD,SGD,HKD,NOK,KRW,TRY,INR,RUB,BRL,ZAR,DKK,PLN,TWD,THB,MYR,KZT,BYN,AMD,GEL,UAH&base=${currency}`, this._requestOptions)
            .then(response => response.json())
            .then(result => result)
            .catch(error => console.error('Произошла ошибка запроса ApiLayer', error));
    }
}
export { FetchHandler }