/* eslint-disable @typescript-eslint/no-explicit-any */

import { fetchData } from "../utils/fetchData";
import { sendWsMessage } from "../utils/webSocket";


interface accountsState {
    [key: string]: any;
}

export class AccountsService {
    private accounts: string[] = [
        "OM6MRCKILRNNBYSSM3NHOQVRCX4EKF3YMA4EKHIGYWAV553Y57ZO2B7EFM",
        "IVBHJFHZWPXRX2EA7AH7Y4UTTBO2AK73XI65OIXDEAEN7VO2IHWXKOKOVM",
        "KWNBRP4E6X7POFIPCDNX5NZBY2YHW4RRH67RBWRCII5BZVZ5NLTGCBANUU",
        "7O3IVAXXX645ZDKBOJIRXW7ULW4B77KK4B5KGVRIIYR3CTK2U5KRLLXWFQ",
        "SDA6DSYRY6P3JIVRA74YD37EXIBMM5FAYCIGXRSWARON6YMWHJSNU3TLDY",
        "JY2FRXQP7Q6SYH7QE2HF2XWNE644V6KUH3PYC4SYWPUSEATTDJSNUHMHR4"
    ];
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
        }, 6000);
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
        let stateChanged = false;

        try {
            const accountDataPromises = this.accounts.map(account =>
                fetchData(`https://mainnet-api.algonode.cloud/v2/accounts/${account}`)
            );
            const accountsData = await Promise.all(accountDataPromises);
            accountsData.forEach((currentAccountData, index) => {
                const account = this.accounts[index];
                const currentBalance = currentAccountData ? currentAccountData.amount : null;
                if (!updatedAccState[account] || updatedAccState[account].amount !== currentBalance) {
                    console.log(`Balance changed for account ${account}. Previous: ${updatedAccState[account] ? updatedAccState[account].amount : 'N/A'}, Current: ${currentBalance}`);
                    updatedAccState[account] = currentAccountData;
                    stateChanged = true;
                    sendWsMessage('balanceChange', { account, newState: currentAccountData });
                }
            });
            if (stateChanged) {
                this.accountsState = updatedAccState;
                console.log("Accounts State Updated");
            } else {
                console.log("📨 No changes in accounts state.");
            }
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
        this.checkAccountsStates()
    }

    removeAccount(address: string): void {
        const index = this.accounts.indexOf(address);
        if (index > -1) {
            this.accounts.splice(index, 1);
            delete this.accountsState[address];
            console.log(`Account ${address} removed from watcher list`);
        }
        this.checkAccountsStates()
    }

    getCurrentaccountsState = async () => {
        return this.accountsState
    };


}