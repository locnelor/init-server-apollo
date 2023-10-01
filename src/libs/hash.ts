import { BinaryLike, createHash } from "crypto"

export const md5 = (data: BinaryLike) => createHash("md5").update(data.toString()).digest("hex")
export const sha1 = (data: BinaryLike) => createHash("sha1").update(data.toString()).digest("hex")
export const cryptoPassword = (data: BinaryLike) => {
    return md5(sha1(`${data}`));
}
export const createUid = (args = [] as string[]) => {
    return md5(sha1(`${Math.random()}_${Date.now()}_${args.join("_")}`))
}
