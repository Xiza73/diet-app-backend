import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

passport.use(
  new LocalStrategy((clientToken: string, done: any) => {
    try {
      if (clientToken == "19IzPdEzBrMCao0m") {
        return done(null, {
          id: "123",
        });
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

passport.serializeUser((client: Express.User | any, done: any) => {
  done(null, client.id);
});

passport.deserializeUser((_, done) => {
  done(null, {
    id: "123",
  });
});
