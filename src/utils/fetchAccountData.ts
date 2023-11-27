import axios from "axios";

export async function fetchAccountData(address: string) {
    try {
        const url = `https://mainnet-api.algonode.cloud/v2/accounts/${address}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}