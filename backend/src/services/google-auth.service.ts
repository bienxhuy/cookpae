import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import passport from "passport";
import bcrypt from "bcrypt";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/user.repository";

export class GoogleAuthService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
    this.initializePassport();
  }

  private initializePassport() {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackURL = process.env.GOOGLE_CALLBACK_URL;

    if (!googleClientId || !googleClientSecret || !callbackURL) {
      throw new Error("Google OAuth credentials are not configured");
    }

    passport.use(
      new GoogleStrategy(
        {
          clientID: googleClientId,
          clientSecret: googleClientSecret,
          callbackURL: callbackURL,
          scope: ["profile", "email"],
        },
        async (
          accessToken: string,
          refreshToken: string,
          profile: Profile,
          done: VerifyCallback
        ) => {
          try {
            const email = profile.emails?.[0]?.value;
            if (!email) {
              return done(new Error("No email found in Google profile"), undefined);
            }

            // Check if user exists
            let user = await this.userRepository.findByEmail(email);

            if (!user) {
              // Create new user with Google data
              const name = profile.displayName || profile.name?.givenName || "Google User";
              // Generate a random password for Google users (they won't use it)
              const randomPassword = await bcrypt.hash(
                Math.random().toString(36).slice(-8) + Date.now().toString(),
                10
              );

              user = new User(name, email, randomPassword);
              user = await this.userRepository.save(user);
            }

            return done(null, user);
          } catch (error) {
            return done(error as Error, undefined);
          }
        }
      )
    );

    // Serialize user for session 
    // Our system is using JWT, this is required by passport
    passport.serializeUser((user: any, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id: number, done) => {
      try {
        const user = await this.userRepository.findById(id);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    });
  }

  getPassportInstance() {
    return passport;
  }
}
