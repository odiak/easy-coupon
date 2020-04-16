import memoizeOne from 'memoize-one'
import firebase from 'firebase/app'
import 'firebase/auth'

export type User = firebase.User

type AuthProviderType = 'google' | 'facebook'

const pendingCredentialKey = '__easyCouponPendingCredential'

export class AuthService {
  static getInstance = memoizeOne(() => new AuthService())

  private auth = firebase.auth()
  private authProviders: { [K in AuthProviderType]: firebase.auth.AuthProvider } = {
    google: new firebase.auth.GoogleAuthProvider(),
    facebook: new firebase.auth.FacebookAuthProvider()
  }

  private didHandleRedirectResult = false

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return this.auth.onAuthStateChanged(callback)
  }

  signIn(providerType: AuthProviderType): void {
    this.auth.signInWithRedirect(this.authProviders[providerType])
  }

  signOut(): void {
    this.auth.signOut()
  }

  async handleRedirectResult() {
    if (this.didHandleRedirectResult) return

    const cred = await this.auth
      .getRedirectResult()
      .catch(async (error: firebase.auth.AuthError) => {
        if (error.code === 'auth/account-exists-with-different-credential') {
          const { credential: pendingCred, email } = error
          console.log(pendingCred)
          if (email == null || pendingCred == null) return
          const methods = await this.auth.fetchSignInMethodsForEmail(email)
          if (methods[0] === 'password') return
          const provider = this.getProviderForProviderId(methods[0])
          if (provider == null) return
          sessionStorage.setItem(pendingCredentialKey, JSON.stringify(pendingCred.toJSON()))
          await this.auth.signInWithRedirect(provider)
        }
      })
    if (cred != null) {
      this.processPendingCredential(cred)
    }

    this.didHandleRedirectResult = true
  }

  private getProviderForProviderId(id: string): firebase.auth.AuthProvider | null {
    for (const provider of Object.values(this.authProviders)) {
      if (provider.providerId === id) {
        return provider
      }
    }
    return null
  }

  private async processPendingCredential(cred: firebase.auth.UserCredential) {
    const pendingCredJSON = sessionStorage.getItem(pendingCredentialKey)
    if (pendingCredJSON == null) return
    const pendingCred = firebase.auth.AuthCredential.fromJSON(JSON.parse(pendingCredJSON))
    if (pendingCred == null) return
    await cred.user?.linkAndRetrieveDataWithCredential(pendingCred)
    sessionStorage.removeItem(pendingCredentialKey)
  }
}
