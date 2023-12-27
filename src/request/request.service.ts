import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from "axios"
@Injectable()
export class RequestService {
    private readonly fetch = axios.create({})
    constructor() { }
    public queryParse(url: string, query: { [key in string]: string }) {
        const arr = [];
        for (const key in query) {
            arr.push(`${key}=${query[key]}`);
        }
        return url + "?" + arr.join("&");
    }
    public get<T>(url: string, config?: AxiosRequestConfig<T>) {
        return axios.get(url, config)
    }
    public post<T>(url: string, config?: AxiosRequestConfig<T>) {
        return axios.post(url, config);
    }
}
