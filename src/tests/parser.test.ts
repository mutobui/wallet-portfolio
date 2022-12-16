import test from 'ava';
import Decimal from 'decimal.js';
import {
    build_wallet, build_wallet_by_date,
    get_latest_portfolio,
    get_portfolio_by_date,
    get_prices,
} from '../parser';

import { Wallet } from '../types/token';
import { Transaction } from '../types/transaction';

const test_data = [
    // 2019-10-26
    ["1572028270", "WITHDRAWAL", "XRP", "0.650535"],
    ["1572028267", "DEPOSIT", "XRP", "3.650535"],

    // 2019-10-25
    ["1571967208", "DEPOSIT", "BTC", "0.298660"],
    ["1571967200", "DEPOSIT", "ETH", "0.683640"],
    ["1571967189", "WITHDRAWAL", "ETH", "0.493839"],
    ["1571967150", "DEPOSIT", "XRP", "0.693272"],
    ["1571967110", "DEPOSIT", "ETH", "0.347595"],
    ["1571967067", "WITHDRAWAL", "XRP", "0.393786"],
    ["1571966982", "WITHDRAWAL", "ETH", "0.266166"],
    ["1571966896", "WITHDRAWAL", "XRP", "0.819840"],
    ["1571966868", "WITHDRAWAL", "XRP", "0.969999"],
]


test('Build Wallet', async (t) => {

    // init
    let input = "src/tests/transaction_test.csv";

    let wallet = new Wallet();
    test_data.forEach(txs => {
        let tx = new Transaction(txs[0], txs[1], txs[2], txs[3]);
        wallet.add_tx(tx);
    });
    let wallet2 = await build_wallet(input);

    t.deepEqual(wallet2, wallet);
});

test('Get Balance', async (t) => {
    let output = [
        {
            token: "XRP",
            balance: new Decimal(1.509647),
        },
        {
            token: "BTC",
            balance: new Decimal(0.298660),
        },
        {
            token: "ETH",
            balance: new Decimal(0.271230),
        },
    ]
    let path = "src/tests/transaction_test.csv";
    let wallet = await build_wallet(path);

    t.deepEqual(wallet.data, output);
});

test('Get Portfolio', async (t) => {
    let output = [
        {
            token: "XRP",
            balance: (new Decimal(1.509647)).mul(await get_prices("XRP")),
        },
        {
            token: "BTC",
            balance: new Decimal(0.298660).mul(await get_prices("BTC")),
            // balance: new Decimal(0.298660),
        },
        {
            token: "ETH",
            balance: new Decimal(0.271230).mul(await get_prices("ETH")),
            // balance: new Decimal(0.271230),
        },
    ]

    let input = "src/tests/transaction_test.csv"

    let portfolio = await get_latest_portfolio(input);

    for (let i = 0; i < portfolio.length; i++) {
        t.deepEqual(portfolio[i].balance,
            (output.filter(token => token.token == portfolio[i].token))[0].balance, `token: ${portfolio[i].token}`);
    }
})

test('Build Wallet By Date', async (t) => {
    let input = "src/tests/transaction_test.csv";
    let date = 1571967220;

    let wallet = new Wallet();
    for (let i = 2; i < test_data.length; i++) {
        let data = test_data[i];
        let tx = new Transaction(data[0], data[1], data[2], data[3]);
        wallet.add_tx(tx);
    }

    let wallet2 = await build_wallet_by_date(input, date);

    t.deepEqual(wallet2, wallet);
});

test('Get Portfolio By Date', async (t) => {
    let output = [
        {
            token: "XRP",
            balance: new Decimal(-1.490353).mul(await get_prices("XRP")),
        },
        {
            token: "BTC",
            balance: new Decimal(0.298660).mul(await get_prices("BTC")),
        },
        {
            token: "ETH",
            balance: new Decimal(0.271230).mul(await get_prices("ETH")),
        },
    ]

    let input = "src/tests/transaction_test.csv"
    let date = 1571967220;

    let portfolio = await get_portfolio_by_date(input, date);

    for (let i = 0; i < portfolio.length; i++) {
        t.deepEqual(portfolio[i].balance,
            (output.filter(token => token.token == portfolio[i].token))[0].balance, `token: ${portfolio[i].token}`);
    }

})
