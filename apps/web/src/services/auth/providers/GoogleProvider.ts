import type { AuthResult, IAuthProvider } from "../types";

/** Mock delay to simulate network latency */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class GoogleProvider implements IAuthProvider {
  readonly name = "google" as const;
  readonly displayName = "Google";

  async signIn(): Promise<AuthResult> {
    // TODO: Replace with real Google OAuth flow
    await delay(1500);
    return {
      success: true,
      user: {
        id: "google_mock_001",
        email: "student@gmail.com",
        name: "Demo Student",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=google",
        role: "STUDENT",
        onboardingCompleted: false,
        providers: ["google"],
      },
    };
  }
}
