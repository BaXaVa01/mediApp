import Cookies from 'js-cookie';

export type AccountType = 'DOCTOR' | 'PATIENT';

export type AuthUser = {
  userId: string;
  profileId: string;
  accountType: AccountType;
  role: string;
  name: string;
  displayName: string;
  email: string;
  phone?: string;
  defaultRoute?: string;
};

export type LoginResponse = {
  token?: string;
  tokenType?: string;
  userId: string;
  profileId: string;
  accountType: AccountType;
  role: string;
  name: string;
  displayName: string;
  email: string;
  phone?: string;
  defaultRoute?: string;
  message?: string;
};

const TOKEN_COOKIE_NAME = 'medifind_token';
const USER_COOKIE_NAME = 'medifind_user';

// En producción ideal, el backend debería setear cookie HttpOnly.
const getCookieOptions = () => ({
  expires: 7, // 7 days
  sameSite: 'lax' as const,
  secure: window.location.protocol === 'https:',
});

export function saveAuthSession(response: LoginResponse): void {
  const options = getCookieOptions();

  if (response.token) {
    Cookies.set(TOKEN_COOKIE_NAME, response.token, options);
  }

  const user: AuthUser = {
    userId: response.userId,
    profileId: response.profileId,
    accountType: response.accountType,
    role: response.role,
    name: response.name,
    displayName: response.displayName,
    email: response.email,
    phone: response.phone,
    defaultRoute: response.defaultRoute,
  };

  Cookies.set(USER_COOKIE_NAME, JSON.stringify(user), options);
}

export function getAuthToken(): string | undefined {
  return Cookies.get(TOKEN_COOKIE_NAME);
}

export function getAuthUser(): AuthUser | null {
  const userStr = Cookies.get(USER_COOKIE_NAME);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as AuthUser;
  } catch (error) {
    console.error('Error parsing user cookie:', error);
    // If the cookie is corrupt, we'll clear everything
    clearAuthSession();
    return null;
  }
}

export function clearAuthSession(): void {
  Cookies.remove(TOKEN_COOKIE_NAME);
  Cookies.remove(USER_COOKIE_NAME);
}
