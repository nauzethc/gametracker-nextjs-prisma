import { PlayIcon } from '@heroicons/react/solid'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { toString } from '../../utils/url'

function getErrorMessage (errorCode: string | undefined): string {
  switch (errorCode) {
    case 'OAuthSignin':
      return 'Could not construct a valid request to this OAuth provider.'
    case 'OAuthCallback':
      return 'Could not handle response from OAuth provider.'
    case 'OAuthCreateAccount':
      return 'Could not create OAuth provider user.'
    case 'OAuthAccountNotLinked':
      return 'This account is already linked with another OAuth provider.'
    default:
      return errorCode ?? 'Unknown error'
  }
}

function SignInError ({ error = '' }: { error: string | string[] | undefined }) {
  const message = getErrorMessage(toString(error))
  return message
    ? <p className="error flex items-start gap-4 w-full">
      <strong>Error</strong>
      <span>{message}</span>
    </p>
    : null
}

export default function SignInView () {
  const router = useRouter()
  const { error } = router.query
  const { data: session } = useSession()

  useEffect(() => {
    if (session) router.push('/')
  }, [session])

  return (
    <div className="sign-in-view grid h-screen gap-12 place-content-center">
      <div className="logo flex items-center justify-center text-3xl">
        <span className="font-light">Game</span>
        <span className="font-bold">Tracker</span>
        <PlayIcon className="w-10 h-10" />
      </div>

      <div className="flex flex-col gap-2 w-full max-w-xs place-self-center">
        <button className="btn-github h-10" onClick={() => signIn('github')} aria-label="github sign in">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"></path></svg>
          <span>Sign-in with Github</span>
        </button>
        <button className="btn-twitch h-10" onClick={() => signIn('twitch')} aria-label="twitch sign in">
          <svg viewBox="0 0 500 500" aria-hidden="true" className="h-6 w-6" fill="currentColor"><g><path d="M329.3,384.8h-71.4l-47.6,47.7h-47.6v-47.7H75.5V131l23.7-63.5h325.2v222.2L329.3,384.8z M392.8,273.8V99.3H131v230.1h71.4v47.6l47.6-47.6h87.2L392.8,273.8z"/><path d="M305.5,162.8V258h31.8v-95.3H305.5z M218.2,257.9H250v-95.1h-31.8V257.9z"/></g></svg>
          <span>Sign-in with Twitch</span>
        </button>
        <button className="btn-google h-10" onClick={() => signIn('google')} aria-label="google sign in">
          <svg viewBox="0 0 1024 1024" aria-hidden="true" className="h-6 w-6" fill="currentColor"><path d="M881 442.4H519.7v148.5h206.4c-8.9 48-35.9 88.6-76.6 115.8-34.4 23-78.3 36.6-129.9 36.6-99.9 0-184.4-67.5-214.6-158.2-7.6-23-12-47.6-12-72.9s4.4-49.9 12-72.9c30.3-90.6 114.8-158.1 214.7-158.1 56.3 0 106.8 19.4 146.6 57.4l110-110.1c-66.5-62-153.2-100-256.6-100-149.9 0-279.6 86-342.7 211.4-26 51.8-40.8 110.4-40.8 172.4S151 632.8 177 684.6C240.1 810 369.8 896 519.7 896c103.6 0 190.4-34.4 253.8-93 72.5-66.8 114.4-165.2 114.4-282.1 0-27.2-2.4-53.3-6.9-78.5z"/></svg>
          <span>Sign-in with Google</span>
        </button>
      </div>

      <SignInError error={error} />
    </div>
  )
}
