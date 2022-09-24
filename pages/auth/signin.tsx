import { PlayIcon } from '@heroicons/react/solid'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function SignInView () {
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (session) router.push('/')
  }, [session])

  return (
    <div className="sign-in-view grid h-screen gap-12 place-content-center">
      <div className="logo flex items-center text-3xl">
        <span className="font-light">Game</span>
        <span className="font-bold">Tracker</span>
        <PlayIcon className="w-10 h-10" />
      </div>

      <div className="flex flex-col gap-2 w-full max-w-xs">
        <button className="btn-github h-10" onClick={() => signIn('github')}>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"></path></svg>
          <span>Sign-in with Github</span>
        </button>
        {/*
        <button className="btn-google h-10" onClick={() => signIn('google')}>
          <svg viewBox="0 0 30 30" aria-hidden="true" className="h-6 w-6" fill="currentColor"><path d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z"></path></svg>
          <span>Sign-in with Google</span>
        </button>
        */}
      </div>
    </div>
  )
}
