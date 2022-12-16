import { parse } from "csv-parse";
import { Transaction, Wallet } from "../types";
import * as fs from "fs";
import axios from "axios";
import Decimal from "decimal.js";

var Prices = [];
var QueryFlag = false;

export async function get_prices(token: string) {

    for (let i = 0; i < Prices.length; i++) {
        if (token == Prices[i].token) {
            return Prices[i].price;
        }
    }

    while (!QueryFlag) {
        QueryFlag = true;
        let price = await get_price(token);
        Prices.push({
            token: token,
            price: price,
        });
        QueryFlag = false;
        return price;
    }

    await new Promise(r => setTimeout(r, 1000)); // prevent spamming api
    return await get_prices(token);
}

export async function build_wallet(resource_path: string) {
    return new Promise<Wallet>((resolve) => {
        let wallet = new Wallet();

        fs.createReadStream(resource_path)
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

async function get_price(token: string) {
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
        let price = await get_prices(token_data.token);
        portfolio.push({
            token: token_data.token,
            balance: token_data.balance.mul(price),
        })
    }

    return portfolio;
}

/// Given a token, return the latest portfolio value for that token in USD
export async function get_latest_portfolio_by_token(token: string, resource_path: string) {
    let portfolio = await get_latest_portfolio(resource_path);
    for (let i = 0; i < portfolio.length; i++) {
        if (portfolio[i].token === token) {
            return portfolio[i];
        }
    }
    return null;
}

export async function build_wallet_by_date(resource_path: string, date: string | number | Date) {
    return new Promise<Wallet>((resolve) => {
        let wallet = new Wallet();

        fs.createReadStream(resource_path)
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on('data', function (row) {

                let portfolio_date;
                if (typeof date === "string") {
                    portfolio_date = new Date(date);
                } else if (typeof date === "number") {
                    portfolio_date = new Date(date * 1000);
                } else {
                    portfolio_date = date;
                }

                let source_date = new Date(Number(row[0]) * 1000);

                if (source_date < portfolio_date) {
                    wallet.add_tx(new Transaction(row[0], row[1], row[2], row[3]));
                }
            })
            .on('end', function () {
                resolve(wallet);
                console.log('Data loaded')
            })
    })
}

/// Given a date, return the portfolio value per token in USD on that date
export async function get_portfolio_by_date(resource_path: string, date: string | number | Date) {
    let wallet = await build_wallet_by_date(resource_path, date);
    let portfolio = [];

    for (let i = 0; i < wallet.data.length; i++) {
        let token_data = wallet.data[i];
        let price = await get_prices(token_data.token);
        portfolio.push({
            token: token_data.token,
            balance: token_data.balance.mul(price),
        })
    }

    return portfolio;
}

/// Given a date and a token, return the portfolio value of that token in USD on that date
export async function get_portfolio_by_date_and_token(source_path: string, date: string | number, token: string) {
    let portfolio = await get_portfolio_by_date(source_path, date);

    for (let i = 0; i < portfolio.length; i++) {
        if (portfolio[i].token === token) {
            return portfolio[i];
        }
    }
    return null;
}