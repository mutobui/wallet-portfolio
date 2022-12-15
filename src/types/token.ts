import { Transaction, TransactionType } from "./transaction";
import Decimal from 'decimal.js';

export class Wallet {

    data: {
        token: string;
        transactions: Transaction[];
    }[];

    constructor(tx?: Transaction) {
        if (tx) {
            this.data = [
                {
                    token: tx.token,
                    transactions: [tx],
                }
            ]
        } else {
            this.data = [];
        }
    }

    add_tx(tx: Transaction) {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].token == tx.token) {
                this.data[i].transactions.push(tx);
                return;
            }
        }

        this.data.push({
            token: tx.token,
            transactions: [tx],
        });
    }

    get_balance() {
        let result = [];

        for (let i = 0; i < this.data.length; i++) {

            let txs = this.data[i].transactions;
            let balance = new Decimal(0);
            for (let j = 0; j < txs.length; j++) {
                let amount = new Decimal(txs[j].amount);

                if (txs[j].transaction_type == TransactionType.DEPOSIT) {

                    balance = balance.plus(amount);
                } else {
                    balance = balance.minus(amount);
                }
            }

            result.push({
                token: this.data[i].token,
                balance: balance.toFixed(6),
            })
        }

        return result;
    }

    is_equal(wallet: Wallet) {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].token != wallet.data[i].token) {
                return false;
            }

            if (JSON.stringify(this.data[i].transactions) != JSON.stringify(wallet.data[i].transactions)) {
                return false;
            }
        }
        return true;
    }
}
