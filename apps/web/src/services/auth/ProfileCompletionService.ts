import type { AuthUser } from "./types";

/**
 * Service to manage the user's profile completion (onboarding) state.
 *
 * It determines if a user needs to complete onboarding after authentication.
 * Actual onboarding screens will be built in the next milestone.
 */
class ProfileCompletionServiceClass {
  /**
   * Checks if the authenticated user has completed their profile.
   * If false, the frontend should redirect them to the /onboarding route.
   */
  needsOnboarding(user: AuthUser): boolean {
    return !user.onboardingCompleted;
  }

  /**
   * Returns the redirect path based on the user's onboarding state.
   */
  getRedirectPath(user: AuthUser): string {
    return this.needsOnboarding(user) ? "/onboarding" : "/dashboard";
  }

  // TODO (Next Milestone): Add methods to fetch required fields, submit onboarding form, etc.
}

export const ProfileCompletionService = new ProfileCompletionServiceClass();
