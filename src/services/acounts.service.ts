/* eslint-disable @typescript-eslint/no-explicit-any */

import { fetchData } from "../utils/fetchData";


interface accountsState {
    [key: string]: any;
}

export class AccountsService {
    private accounts: string[] = []; 
    private accountsState: accountsState = {};

    constructor() {
    }
    async checkaccountsStates(): Promise<accountsState> {
        console.log("🚧 Checking Account States");
        const updatedAccState = { ...this.accountsState };
        const accountDataPromises = this.accounts.map(account => fetchData(account));
        const accountsData = await Promise.all(accountDataPromises);
        console.log("accounts data", accountsData)


        return updatedAccState;
    }

    addAccount(address: string): void {
        if (!this.accounts.includes(address)) {
            this.accounts.push(address);
            console.log(`Account ${address} added to watcher list`);
        }
    }

    removeAccount(address: string): void {
        const index = this.accounts.indexOf(address);
        if (index > -1) {
            this.accounts.splice(index, 1);
            delete this.accountsState[address];
            console.log(`Account ${address} removed from watcher list`);
        }
    }

    getCurrentaccountsState = async () => {
        const res = await this.checkaccountsStates()
        return res
    };


}