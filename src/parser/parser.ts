import { parse } from "csv-parse";
import { Transaction, Wallet } from "../types";
import * as fs from "fs";
import axios from "axios";
import Decimal from "decimal.js";

export async function build_wallet(_path: string) {
    return new Promise<Wallet>((resolve) => {
        let wallet = new Wallet();

        fs.createReadStream(_path)
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on('data', function (row) {
                wallet.add_tx(new Transaction(row[0], row[1], row[2], row[3]));
            })
            .on('end', function () {
                resolve(wallet);
                console.log('Data loaded')
            })
    })
}

export async function get_price(token: string) {
    let price_api = `https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=USD`;
    const response = await axios.get(price_api);
    return new Decimal(response.data.USD);
}

/// Given no parameters, return the latest portfolio value per token in USD
export async function get_latest_portfolio(resource_path: string) {
    let wallet = await build_wallet(resource_path);
    let portfolio = [];

    for (let i = 0; i < wallet.data.length; i++) {
        let token_data = wallet.data[i];
        let price = await get_price(token_data.token);
        portfolio.push({
            token: token_data.token,
            balance: token_data.balance.mul(price),
        })
    }

    return portfolio;
}

/// Given a token, return the latest portfolio value for that token in USD
export async function get_latest_portfolio_by_token(token: string, source_path: string) {
    let portfolio = await get_latest_portfolio(source_path);
    for (let i = 0; i < portfolio.length; i++) {
        if (portfolio[i].token === token) {
            return portfolio[i];
        }
    }
    return null;
}

/// Given a date, return the portfolio value per token in USD on that date
export function get_portfolio_by_date() {

}

/// Given a date and a token, return the portfolio value of that token in USD on that date
export function get_portfolio_by_date_and_token() {

}