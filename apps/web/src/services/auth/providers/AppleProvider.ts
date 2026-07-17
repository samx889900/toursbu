import type { AuthResult, IAuthProvider } from "../types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class AppleProvider implements IAuthProvider {
  readonly name = "apple" as const;
  readonly displayName = "Apple";

  async signIn(): Promise<AuthResult> {
    // TODO: Replace with real Apple OAuth flow
    await delay(1500);
    return {
      success: true,
      user: {
        id: "apple_mock_001",
        email: "student@icloud.com",
        name: "Demo Student",
        avatar: null,
        role: "STUDENT",
        onboardingCompleted: false,
        providers: ["apple"],
      },
    };
  }
}
