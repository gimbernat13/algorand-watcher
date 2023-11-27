"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAccount = exports.addAccount = exports.fetchAccountData = exports.getCurrentAccountState = void 0;
const dotenv = __importStar(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const lodash_1 = __importDefault(require("lodash"));
dotenv.config();
// TODO: ADD CHECK FOR ADDRESS
const accounts = [
    "OM6MRCKILRNNBYSSM3NHOQVRCX4EKF3YMA4EKHIGYWAV553Y57ZO2B7EFM",
    "IVBHJFHZWPXRX2EA7AH7Y4UTTBO2AK73XI65OIXDEAEN7VO2IHWXKOKOVM",
    "KWNBRP4E6X7POFIPCDNX5NZBY2YHW4RRH67RBWRCII5BZVZ5NLTGCBANUU",
    "7O3IVAXXX645ZDKBOJIRXW7ULW4B77KK4B5KGVRIIYR3CTK2U5KRLLXWFQ",
    "SDA6DSYRY6P3JIVRA74YD37EXIBMM5FAYCIGXRSWARON6YMWHJSNU3TLDY",
];
let accountState = {};
let isFirstRun = true;
function findDifferences(obj1, obj2) {
    const differences = {};
    Object.keys(Object.assign(Object.assign({}, obj1), obj2)).forEach(key => {
        if (key === "round")
            return; // Skip the "round" key
        if (!lodash_1.default.isEqual(obj1[key], obj2[key])) {
            differences[key] = { from: obj1[key], to: obj2[key] };
        }
    });
    return differences;
}
function checkAccountStates() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🚧 Checking Account States");
        const updatedAccState = Object.assign({}, accountState);
        let stateHasChanged = false;
        for (const account of accounts) {
            try {
                const currentAccountData = yield fetchAccountData(account);
                if (!lodash_1.default.isEqual(accountState[account], currentAccountData)) {
                    stateHasChanged = true;
                    const diffs = accountState[account] && findDifferences(accountState[account], currentAccountData);
                    console.log(`Differences for account ${account}:`, diffs);
                    // Emit WebSocket event or log differences
                }
                const currentBalance = currentAccountData ? currentAccountData.amount : null;
                if (accountState && accountState[account].amount !== currentBalance) {
                    stateHasChanged = true;
                    console.log(`Balance changed for account ${account}. Previous: ${accountState[account].amount}, Current: ${currentBalance}`);
                    // Emit WebSocket event or log for balance change
                }
                updatedAccState[account] = currentAccountData;
            }
            catch (error) {
                console.error(`Error fetching data for account ${account}:`, error);
                console.log("accounts ", accounts);
            }
        }
        if (isFirstRun || stateHasChanged) {
            accountState = updatedAccState;
            isFirstRun = false;
            console.log("Accounts State Updated");
        }
    });
}
setInterval(checkAccountStates, 6000);
const getCurrentAccountState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield checkAccountStates();
    res.json(accountState);
});
exports.getCurrentAccountState = getCurrentAccountState;
function fetchAccountData(address) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = `https://mainnet-api.algonode.cloud/v2/accounts/${address}`;
            const response = yield axios_1.default.get(url);
            return response.data;
        }
        catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    });
}
exports.fetchAccountData = fetchAccountData;
const addAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const address = req.params.address;
    try {
        accounts.push(address);
        res.status(200).send(`Account ${address} added to watcher list`);
        console.log("Accounts ", accounts);
    }
    catch (error) {
        console.log("error", error);
    }
});
exports.addAccount = addAccount;
const removeAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const address = req.params.address;
    const index = accounts.indexOf(address);
    if (index > -1) {
        accounts.splice(index, 1);
        delete accountState[address];
        yield checkAccountStates();
        res.status(200).send(`Account ${address} removed from watcher list`);
        console.log("Updated Accounts List: ", accounts);
        console.log("Updated Account States: ", accountState);
    }
    else {
        res.status(404).send(`Account ${address} not found`);
    }
});
exports.removeAccount = removeAccount;
