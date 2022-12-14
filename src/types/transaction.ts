

export enum TransactionType {
    DEPOSIT,
    WITHDRAW,
}

export enum Token {

}

export class Transaction {
    timestamp: Date;
    transaction: TransactionType;
}
