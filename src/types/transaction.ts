

export enum TransactionType {
    DEPOSIT = "DEPOSIT",
    WITHDRAWAL = "WITHDRAWAL",
}

export class Transaction {

    constructor(_timestamp: string, _transaction: string,
        _token: string, _amount: string) {
        this.timestamp = _timestamp;

        if (_transaction == "DEPOSIT") {
            this.transaction_type = TransactionType.DEPOSIT;
        } else if (_transaction == "WITHDRAWAL") {
            this.transaction_type = TransactionType.WITHDRAWAL;
        }
        this.token = _token;
        this.amount = _amount;
    }

    timestamp: string;
    transaction_type: TransactionType;
    token: string;
    amount: string;
}
