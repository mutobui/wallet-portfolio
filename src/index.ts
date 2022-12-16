import {
    get_latest_portfolio,
    get_portfolio_by_date
} from './parser';

async function main() {
    let portfolio = await get_latest_portfolio("src/resources/transactions.csv");
    console.log("portfolio: ", portfolio);

    let date = new Date("2019-10-25T00:00:00")
    let date_portfolio = await get_portfolio_by_date("src/resources/transactions.csv", date);
    console.log(`${date} portfolio: `, date_portfolio);
}

main();