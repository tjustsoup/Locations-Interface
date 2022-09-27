import { ApiClient, QueryArg, IConfig, IResult, IPlugin } from "jsonapi-react";
import { TeamsFx } from "@microsoft/teamsfx";

export class JsonApiClient extends ApiClient {
  teamsfx;
  constructor({
    ...args
  }: {
    schema?: {};
    plugins?: IPlugin[];
    teamsfx?: TeamsFx;
  } & IConfig) {
    super({ ...args });
    if (!args.teamsfx) {
        throw new Error("TeamsFx SDK is not initialized.");
    }
    this.teamsfx = args.teamsfx;
  }

  async getToken(): Promise<string> {
    const credential = this.teamsfx!.getCredential();
    return (await credential.getToken("User.Read"))!.token || "";
  }
  async setAuth(config?: IConfig) {
    if (config) {
      config.headers = {
        ...config.headers,
        Authorization: "Bearer " + (await this.getToken()),
      };
    } else {
      this.addHeader("Authorization", "Bearer " + (await this.getToken()));
    }
  }
  async delete(queryArg: QueryArg, config?: IConfig): Promise<IResult> {
    await this.setAuth(config);
    return super.delete(queryArg, config);
  }
  async fetch(queryArg: QueryArg, config?: IConfig): Promise<IResult> {
    await this.setAuth(config);
    return super.fetch(queryArg, config);
  }
  async mutate(
    queryArg: QueryArg,
    data: {} | [],
    config?: IConfig
  ): Promise<IResult> {
    await this.setAuth(config);
    return super.mutate(queryArg, data, config);
  }
}
