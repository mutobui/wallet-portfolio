import { parse } from "csv-parse";
import { Transaction, Wallet } from "../types";
import * as fs from "fs";

export function parser_data() {
    console.log("Hello world");
}

async function read_csv(csvFilePath: string) {
    return new Promise<Transaction[]>((resolve) => {
        const headers = ['timestamp', 'transaction_type', 'token', 'amount'];

        const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

        parse(fileContent, {
            delimiter: ',',
            columns: headers,
        }, (error, result: Transaction[]) => {
            if (error) {
                console.error(error);
            }
            resolve(result);
        });
    });
};

export async function build_wallet(_path: string) {
    let txs = await read_csv(_path);

    let wallet = new Wallet();
    txs.slice(1).forEach(tx => {
        wallet.add_tx(tx);
    });

    return wallet;
}

/// Given no parameters, return the latest portfolio value per token in USD
export function get_latest_portfolio() {

}

/// Given a token, return the latest portfolio value for that token in USD
export function get_latest_portfolio_by_token() {

}

/// Given a date, return the portfolio value per token in USD on that date
export function get_portfolio_by_date() {

}

/// Given a date and a token, return the portfolio value of that token in USD on that date
export function get_portfolio_by_date_and_token() {

}