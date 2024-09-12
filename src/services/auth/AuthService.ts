import { AuthInitEvent, KeycloakService } from '@getinsight.it/getinsight-common';
import { BehaviorSubject } from 'rxjs';

export class AuthService {

  static #instance: AuthService;

  keycloakService: KeycloakService;

  private constructor() {
    console.log('[AuthService] constructor');
    this.keycloakService = new KeycloakService();
  }

  public static get instance(): AuthService {
    if (!AuthService.#instance) {
      AuthService.#instance = new AuthService();
    }

    return AuthService.#instance;
  }

  async signIn(redirectUri?: string): Promise<void> {
    await this.keycloakService.signIn(redirectUri);
  }

  async signOut(redirectUri?: string): Promise<void> {
    await this.keycloakService.signOut(redirectUri);
  }

  async register(redirectUri?: string): Promise<void> {
    await this.keycloakService.register(redirectUri);
  }

  isAuthenticated(): BehaviorSubject<boolean> {
    return this.keycloakService.isAuthenticated() as BehaviorSubject<boolean>;
  }

  getBearerToken(): string | null {
    return this.keycloakService.getBearerToken();
  }

  onInitEvent(): BehaviorSubject<AuthInitEvent> {
    return this.keycloakService.onInitEvent() as BehaviorSubject<AuthInitEvent>;
  }

  onSignOutEvent(): BehaviorSubject<boolean> {
    return this.keycloakService.onSignOutEvent() as BehaviorSubject<boolean>;
  }
}
