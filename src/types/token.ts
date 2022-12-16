import { Transaction, TransactionType } from "./transaction";
import Decimal from 'decimal.js';

export class Wallet {

    data: {
        token: string;
        balance: Decimal;
    }[];

    constructor(tx?: Transaction) {
        if (tx) {
            this.data = [
                {
                    token: tx.token,
                    balance: new Decimal(tx.amount),
                }
            ]
        } else {
            this.data = [];
        }
    }

    add_tx(tx: Transaction) {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].token == tx.token) {
                let amount = new Decimal(tx.amount);
                if (tx.transaction_type == TransactionType.DEPOSIT) {
                    this.data[i].balance = this.data[i].balance.plus(amount);
                } else {
                    this.data[i].balance = this.data[i].balance.minus(amount);
                }
                return;
            }
        }

        let balance;
        if (tx.transaction_type == TransactionType.DEPOSIT) {
            balance = new Decimal(tx.amount);
        } else {
            balance = (new Decimal(tx.amount)).mul(-1);
        }

        this.data.push({
            token: tx.token,
            balance: balance,
        });
    }

    is_equal(wallet: Wallet) {
        if (this.data.length != wallet.data.length) {
            return false;
        }

        for (let i = 0; i < this.data.length; i++) {
            // if (this.data[i].token != wallet.data[i].token) {
            //     return false;
            // }
            if (JSON.stringify(this.data[i]) != JSON.stringify(wallet.data[i])) {
                return false;
            }
        }
        return true;
    }
}
