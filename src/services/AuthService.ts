import memoizeOne from 'memoize-one'
import firebase from 'firebase/app'
import 'firebase/auth'

export type User = firebase.User

export class AuthService {
  static getInstance = memoizeOne(() => new AuthService())

  private auth = firebase.auth()
  private googleAuthProvider = new firebase.auth.GoogleAuthProvider()

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return this.auth.onAuthStateChanged(callback)
  }

  signInWithGoogle(): void {
    this.auth.signInWithRedirect(this.googleAuthProvider)
  }

  signOut(): void {
    this.auth.signOut()
  }
}
