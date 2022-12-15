import test from 'ava';
import Decimal from 'decimal.js';
import { build_wallet, get_price } from '../parser';

// import { read_transaction } from '../parser/parser';
import { Wallet } from '../types/token';
import { Transaction } from '../types/transaction';

const test_data = [
    ["1571967208", "DEPOSIT", "BTC", "0.298660"],
    ["1571967200", "DEPOSIT", "ETH", "0.683640"],
    ["1571967189", "WITHDRAWAL", "ETH", "0.493839"],
    ["1571967150", "DEPOSIT", "XRP", "0.693272"],
    ["1571967110", "DEPOSIT", "ETH", "0.347595"],
    ["1571967067", "WITHDRAWAL", "XRP", "0.393786"],
    ["1571966982", "WITHDRAWAL", "ETH", "0.266166"],
    ["1571966896", "WITHDRAWAL", "XRP", "0.819840"],
    ["1571966868", "WITHDRAWAL", "XRP", "0.969999"],
    ["1571966849", "WITHDRAWAL", "XRP", "0.650535"],
]

test('Build Wallet', async (t) => {
    let input = "src/tests/transaction_test.csv";

    let wallet = new Wallet();
    test_data.forEach(txs => {
        let tx = new Transaction(txs[0], txs[1], txs[2], txs[3]);
        wallet.add_tx(tx);
    });
    let wallet2 = await build_wallet(input);

    t.deepEqual(wallet2.is_equal(wallet), true);
});

test('Get Balance', async (t) => {
    let output = [
        {
            token: "BTC",
            balance: new Decimal(0.298660),
        },
        {
            token: "ETH",
            balance: new Decimal(0.271230),
        },
        {
            token: "XRP",
            balance: new Decimal(-2.140888),
        }
    ]
    let path = "src/tests/transaction_test.csv";
    let wallet = await build_wallet(path);

    t.deepEqual(wallet.data, output);
});

test('Get Price', async (t) => {
    {
        let token = "BTC";
        let price = await get_price(token);
        let bear_price = 10000;
        t.assert(price > bear_price);
    }

    {
        let token = "ETH";
        let price = await get_price(token);
        let bear_price = 500;
        t.assert(price > bear_price);
    }

    {
        let token = "XRP";
        let price = await get_price(token);
        let bear_price = 0.1;
        t.assert(price > bear_price);
    }
})