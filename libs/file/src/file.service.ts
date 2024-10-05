import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { cwd } from 'process';

@Injectable()
export class FileService {
  constructor() { }
  public static readonly Root = cwd();
  public static getSSLKey() {
    return readFileSync(join(this.Root, "keys", "ssh.key"))
  }
  public mkdir(path: string) {
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true })
    }
  }
  public static getSSLPem() {
    return readFileSync(join(this.Root, "keys", "ssh.pem"))
  }
  private readonly Assets = join(FileService.Root, "..", "assets")
  private readonly configFile = join(this.Assets, "config.json")
  public getConfig() {
    try {
      return JSON.parse(readFileSync(this.configFile).toString());
    } catch (err) {
      console.log(`lib(file.service): ${err.message}`)
    }
    return null;
  }
  public setConfig(config: Object) {
    if (!existsSync(this.configFile)) {
      mkdirSync(join(this.configFile, ".."), { recursive: true })
    }
    writeFileSync(this.configFile, JSON.stringify(config))
  }

  public readonly videoRoot = join(this.Assets, "videos")
  public getVideoDir(hash: string) {
    const path = join(this.videoRoot, hash)
    return path
  }
  public getVideoSourceFile(hash: string) {
    return join(this.getVideoDir(hash), "source")
  }

  public readonly pictureRoot = join(this.Assets, "pictures")
  public getPicturePath(hash: string) {
    return join(this.pictureRoot, hash)
  }

  public getVideoOutputFile(hash: string) {
    return join(this.getVideoDir(hash), "index.m3u8")
  }
}
