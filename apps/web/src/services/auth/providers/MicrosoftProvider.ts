import type { AuthResult, IAuthProvider } from "../types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class MicrosoftProvider implements IAuthProvider {
  readonly name = "microsoft" as const;
  readonly displayName = "Microsoft";

  async signIn(): Promise<AuthResult> {
    // TODO: Replace with real Microsoft OAuth flow
    await delay(1500);
    return {
      success: true,
      user: {
        id: "microsoft_mock_001",
        email: "student@outlook.com",
        name: "Demo Student",
        avatar: null,
        role: "STUDENT",
        onboardingCompleted: false,
        providers: ["microsoft"],
      },
    };
  }
}
