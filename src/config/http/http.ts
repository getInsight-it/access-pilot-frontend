import { HttpClient } from '@getinsight.it/getinsight-common';
import { authService } from '../../services/auth';

const httpClient: HttpClient = new HttpClient();

authService.isAuthenticated().subscribe(isAuthenticated => {
    if (isAuthenticated) {
        const token: string = authService.getBearerToken() as string;

        if (token) {
            httpClient.addBearerAuthorization(token);
        }
    }
});

export { httpClient };