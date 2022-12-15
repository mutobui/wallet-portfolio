import test from 'ava';
import { build_wallet } from '../parser';

// import { read_transaction } from '../parser/parser';
import { Wallet } from '../types/token';
import { Transaction } from '../types/transaction';

const test_data = [
    ["1571967208", "DEPOSIT", "BTC", "0.298660"],
    ["1571967200", "DEPOSIT", "ETH", "0.683640"],
    ["1571967189", "WITHDRAWAL", "ETH", "0.493839"],
    ["1571967150", "DEPOSIT", "XRP", "0.693272"],
]

test('Build Wallet', async (t) => {
    let input = "src/tests/transaction_test.csv";

    let wallet = new Wallet();
    test_data.forEach(txs => {
        let tx = new Transaction(txs[0], txs[1], txs[2], txs[3]);
        wallet.add_tx(tx);
    });

    t.deepEqual((await build_wallet(input)).is_equal(wallet), true);
});

test('Get Balance', async (t) => {
    let output = [
        {
            token: "BTC",
            balance: "0.298660"
        },
        {
            token: "ETH",
            balance: "0.189801"
        },
        {
            token: "XRP",
            balance: "0.693272"
        }
    ]
    let path = "src/tests/transaction_test.csv";
    let wallet = await build_wallet(path);
    let balance = wallet.get_balance();

    t.deepEqual(balance, output);
});

