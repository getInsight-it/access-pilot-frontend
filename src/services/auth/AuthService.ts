import { KeycloakService } from '@getinsight.it/getinsight-common';
import { BehaviorSubject } from 'rxjs';

export class AuthService {

    keycloakService: KeycloakService = new KeycloakService();

    constructor() {
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
        return this.keycloakService.isAuthenticated();
    }

    getBearerToken(): string | null {
        return this.keycloakService.getBearerToken();
    }

    onInitEvent(): BehaviorSubject<boolean> {
        return this.keycloakService.onInitEvent();
    }

    onSignOutEvent(): BehaviorSubject<boolean> {
        return this.keycloakService.onSignOutEvent();
    }
}