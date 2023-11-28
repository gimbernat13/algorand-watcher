/* eslint-disable @typescript-eslint/no-explicit-any */

import { fetchData } from "../utils/fetchData";
import { sendWsMessage } from "../utils/webSocket";


interface accountsState {
    [key: string]: any;
}

export class AccountsService {
    private accounts: string[] = [];
    private accountsState: accountsState = {};
    private intervalId: any;

    // Initializes state with existing accounts from file 
    constructor() {
        const initialAccounts = this.accounts
        initialAccounts.forEach(account => {
            this.accountsState[account] = {}; 
        });
        this.intervalId = setInterval(() => {
            this.checkAccountsStates();
        }, 60000);
    }

    stopCheckingAccounts() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log("Stopped checking account states.");
        }
    }

    async checkAccountsStates() {
        console.log("🚧 Checking Account States");
        const updatedAccState = { ...this.accountsState };
        try {
            const accountDataPromises = this.accounts.map(account =>
                fetchData(`https://mainnet-api.algonode.cloud/v2/accounts/${account}`)
            );
            const accountsData = await Promise.all(accountDataPromises);
            accountsData.forEach((currentAccountData, index) => {
                const account = this.accounts[index];
                const currentBalance = currentAccountData ? currentAccountData.amount : null;
                if (updatedAccState[account] && updatedAccState[account].amount !== currentBalance) {
                    console.log(`Balance changed for account ${account}. Previous: ${updatedAccState[account].amount}, Current: ${currentBalance}`);
                    sendWsMessage('balanceChange', { account, newState: updatedAccState });
                }
                updatedAccState[account] = currentAccountData;
            });
            this.accountsState = updatedAccState;
            console.log("Accounts State Updated");
        } catch (error) {
            console.error("Error while fetching account data:", error);
        }

        return this.accountsState;
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
        const res = await this.checkAccountsStates()
        return res
    };


}