import fs from "fs"
import FetchHandler from "../api/ExRate.js";
import _ from "lodash";
const FH = new FetchHandler()

export default class JSONController {
    #A_Curr = []
    #P_Curr = []

    constructor() {
    }

    /** 
    * Создает файл ExRate.json по пути /json/ExEate.json с информацией о курсе валют
    */
    async WriteParsedJson() {

        this.#A_Curr = [
            await FH.GetCurrencyBasedOn("RUB"),
            await FH.GetCurrencyBasedOn("USD"),
            await FH.GetCurrencyBasedOn("EUR"),
            await FH.GetCurrencyBasedOn("JPY"),
            await FH.GetCurrencyBasedOn("GBP"),
            await FH.GetCurrencyBasedOn("CHF"),
            await FH.GetCurrencyBasedOn("CNY"),
        ]

        try {
            if (!this.#A_Curr[this.#A_Curr.length - 1].success === true) {
                console.log("Ошибка при запросе API")
                return
            }
            if (!fs.existsSync("./json")) fs.mkdirSync("./json")
            fs.writeFile("./json/ExRate.json", JSON.stringify(this.#A_Curr, null, "\t"), err => {
                if (err) {
                    console.error("1 Ошибка при создании файла ExRate.\n", err)
                    return
                }
            })
        } catch (err) {
            console.error("2 Ошибка при создании файла ExRate.\n", err)
        }

    }
    /** 
    * Читает файл ExRate.json по пути /json/ExEate.json с информацией о курсе валют
    * @return {Array} Возвращает обьект из JSON
    */
    ReadParsedJson() {
        try {
            if (!fs.existsSync("./json/ExRate.json")) {
                console.log("Файла ExRate не существует. Ожидание создания файла...")
                this.WriteParsedJson()
            }
            else {
                this.#P_Curr = JSON.parse(fs.readFileSync("./json/ExRate.json", "utf8", (err, text) => {
                    if (err) {
                        console.error("1 Ошибка при чтении файла ExRate.\n", err)
                        return
                    }
                    return text
                }))

            }
            return this.#P_Curr
        } catch (err) {
            console.error("2 Ошибка при чтении файла ExRate.\n", err)
        }

    }
}










