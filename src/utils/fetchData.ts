import axios from "axios";

export async function fetchData(url: string) {
    try {

        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}