import { JwtBlacklist } from "./jwt-blacklist.entity";
import { Log } from "./log.entity";
import { User } from "./user.entity";

const entities = [User, JwtBlacklist, Log];

export default entities;