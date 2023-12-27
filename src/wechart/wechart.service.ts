import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestService } from 'src/request/request.service';
import { WxAccessTokenInterface } from './wechart.type';

@Injectable()
export class WechartService {
    private readonly baseUrl = "https://api.weixin.qq.com"
    constructor(
        private readonly config: ConfigService,
        private readonly request: RequestService
    ) { }
    // private component_access_token = null;
    // private component_access_token_time = 0;
    // private component_verify_ticket = "";
    // private async getAccessToken() {
    //     const now = Date.now();
    //     //大于2小时
    //     if (now - this.component_access_token_time > 1000 * 60 * 60 * 2) {
    //         this.component_access_token = await this.getApiAccessToken();
    //     }
    //     return this.component_access_token
    // }
    // private async getApiAccessToken() {
    //     const { data } = await this.request.post("cgi-bin/component/api_component_token", {
    //         data: {
    //             component_appid: this.config.get("WX_APPID"),
    //             component_appsecret: this.config.get("WX_SECRET"),
    //             component_verify_ticket: this.component_verify_ticket
    //         }
    //     });
    //     return data;
    // }

    public async jscode2session(js_code: string) {
        const result = await this.request.get(
            this.request.queryParse(`${this.baseUrl}/sns/jscode2session`, {
                appid: this.config.get("WX_APPID"),
                secret: this.config.get("WX_SECRET"),
                js_code,
                grant_type: "authorization_code"
            })
        )
        console.log(result.data);
        return result.data as WxAccessTokenInterface
    }
}
