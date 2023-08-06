import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { getEnvironment } from "../config";
import { ClientModel } from "../models";
import { logger } from "../utils";

/*
    Header: Authorization -> Bearer <token>
*/

export class PassportMiddleware {
  private readonly options: StrategyOptions;

  constructor() {
    this.options = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: getEnvironment().JWT_SECRET,
    };
  }

  public strategy() {
    return new Strategy(this.options, async (payload, done) => {
      try {
        const client = await ClientModel.findById(payload.id);
        if (client) {
          return done(null, client);
        }
        return done(null, false);
      } catch (err) {
        logger(err);
      }
    });
  }
}
