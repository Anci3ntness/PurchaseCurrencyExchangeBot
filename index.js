import * as dotenv from "dotenv"
import { Telegraf, Markup } from "telegraf"
import JSONController from "./controller/JSONController.js"
import { CronJob } from "cron"
import _ from "lodash"
import { FLAGS } from "./constants/flags.js"
dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN)
const JC = new JSONController()
const cronjob = new CronJob("0 18 * * *", () => {
    console.log("я пидорас")
    JC.WriteParsedJson()
})
cronjob.start()


try {
    //COMMAND START
    bot.command("start", (ctx) => {
        ctx.reply(`Привет, ${ctx.message.from.first_name}. Чтобы узнать курс валюты, введите команду \'Курс валют\' `, Markup.keyboard([["Курс валют"]]).resize())
    })
    //COMMAND END

    //HEARS START
    bot.hears("Курс валют", async (ctx) => {
        await ctx.reply("Выберите тип валюты 💶:", Markup.inlineKeyboard(_.chunk(Object.keys(JC.ReadParsedJson()?.[0]?.rates || []).map(e => {
            return Markup.button.callback(e + FLAGS[e], e)
        }), 3)
        ))
    })
    //HEARS END

    //ACTION START
    bot.action(Object.keys(JC.ReadParsedJson()?.[0]?.rates || []), async (ctx) => {
        await ctx.editMessageText("Выберите валюту для сравнения 💵", Markup.inlineKeyboard(_.chunk(JC.ReadParsedJson().map(e => {
            return Markup.button.callback(e.base + FLAGS[e.base], e.base + "1" + " " + ctx.update.callback_query.data)
        }), 3)))
    })
    bot.action(new RegExp(`\\b(${JC.ReadParsedJson().map(e => e.base + "1").join("|")})\\b`, "g"), async (ctx) => {
        let base = ctx.update.callback_query.data.replace(/\d/g, "").split(" ")[0]
        let rate = ctx.update.callback_query.data.replace(/\d/g, "").split(" ")[1]
        await ctx.editMessageText(`Курс валюты на ${JC.ReadParsedJson().find(f => f.base = base).date}.\n\nКурс ${rate}${FLAGS[rate] || ""} -> ${base}${FLAGS[base] || ""}: 1 к ${JC.ReadParsedJson().find(f => f.base == base).rates[rate]}\n`)
    })
    //ACTION END

    //LISTENER ON START
    bot.on("text", (ctx) => {
        ctx.sendMessage("Чтобы узнать курс валюты, введите команду \'Курс валют\'")
    })
    //LISTENER ON END

    //LAUNCH
    bot.launch().then(console.log("Бот активен!"));

} catch (err) {
    console.error("Произошла ошибка!", err)
}
