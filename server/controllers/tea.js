const teaDataRouter = require("express").Router();
const { spawnSync } = require("child_process");
const sqlite = require("sqlite3").verbose();
const fs = require("fs");
const logger = require("../utils/logger");

teaDataRouter.get("/", async (request, response) => {
  logger.info(process.cwd());
  logger.info(
    `script location: ${__dirname}../services/tea-prices-scraper/main.py`
  );
  try {
    const python = spawnSync("python3", [
      `${__dirname}/../services/tea-prices-scraper/main.py`,
    ]);

    logger.info(python);
    if (python.status !== 0) {
      return response.status(500).end();
    }
    const database = new sqlite.Database(
      "prices.db",
      sqlite.OPEN_READONLY,
      (err) => {
        if (err) {
          logger.error(`Error connecting to database: ${err}`);
        } else {
          logger.info("connected to prices.db");
        }
      }
    );

    const sql = "SELECT * FROM tea";
    data = [];
    database.all(
      sql,
      (err, row) => {
        if (err) throw err;
        // logger.info(row.price);
        // console.log({ price: row.price === "None" ? null : Number(row.price) });
        // let object = { price: row.price === "None" ? null : Number(row.price) };
        // data.push(row);
        // data.push({
        //   price: row.price,
        //   currency: row.currency,
        //   month: row.month,
        //   year: row.year,
        // });
      },
      (err, rows) => {
        return response.json(rows);
      }
    );
    // return response.json(data);
  } catch (err) {
    logger.info(err);
    response.status(500).send();
  }
});

module.exports = teaDataRouter;
