/**
 * @param access_token  接口调用凭证
 * @param expires_in access_token 接口调用凭证超时时间，单位（秒）
 * @param refresh_token 用户刷新 access_token
 * @param openid 授权用户唯一标识
 * @param scope 用户授权的作用域，使用逗号（,）分隔
 * @param unionid 用户统一标识。针对一个微信开放平台账号下的应用，同一用户的 unionid 是唯一的
 */
export interface WxAccessTokenInterface {
    access_token: string //
    expires_in: string //
    refresh_token: string
    openid: string
    scope: string
    unionid: string
    session_key: string
}