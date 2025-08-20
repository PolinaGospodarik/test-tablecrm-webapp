import axios from "axios";

export const createApi = (token: string) => {
    return axios.create({
        baseURL: 'https://app.tablecrm.com/api/v1',
        params: { token },
    });
};
