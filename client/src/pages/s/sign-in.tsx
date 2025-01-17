import React, { useEffect, useState } from 'react'
import _tw from 'twin.macro'
import Link from 'next/link'
import Router from 'next/router'
import Input from '@components/FormFields/Input'
import Button from '@components/Button'
import { useForm } from 'react-hook-form'
import routes from '@lib/utils/routes'
import { useSignInMutation } from '@graphql/hooks'
import { getExceptionErrors } from '@lib/utils/errors'
import IsNotAuthenticated from '@components/Auth/IsNotAuthenticated'
interface IFormValues {
  email: string
  password: string
}

// TODO: add Slatam Logo to top (with link to Home)
// TODO: replace svg google icon

const SignIn = () => {
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    errors,
    setError,
    formState,
  } = useForm<IFormValues>()
  const { isSubmitting } = formState
  const { mutate: signIn, isLoading } = useSignInMutation()

  const submitting = isSubmitting || isLoading

  const onSubmit = async (formData: IFormValues) => {
    const { email, password } = formData

    return signIn(
      {
        data: {
          email,
          password,
        },
      },
      {
        onSuccess: ({ login: user }) => {
          setSuccess(true)
          if (user.information) {
            Router.push(routes.dashboard.index)
          } else {
            Router.push(routes.user.setup.profile)
          }
        },
        onError: (result: any) => {
          const { message } = getExceptionErrors(result?.response?.errors)

          // TODO: move this error code to an enum shared with Backend
          // when we have the monorepo setup
          if (message === 'UNVERIFIED') {
            Router.push(routes.session.pleaseVerify)
            return
          }

          setError('email', {
            shouldFocus: true,
            message: 'Invalid email or password',
          })
          setError('password', {
            message: 'Invalid email or password',
          })
        },
      }
    )
  }

  useEffect(() => {
    Router.prefetch(routes.dashboard.index)
  }, [])

  return (
    <IsNotAuthenticated>
      <section className="bg-gray-100 min-h-screen">
        <div className="container px-0 py-20 mx-auto sm:px-4">
          <div className="w-full px-4 pt-5 pb-6 mx-auto mt-8 mb-6 bg-white rounded-none shadow-2xl sm:rounded-lg sm:w-10/12 md:w-6/12 lg:w-5/12 xl:w-4/12 sm:px-6">
            <h1 className="mb-8 text-3xl font-semibold text-center text-gray-900">
              Sign in
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} tw="mb-8 space-y-2">
              <Input
                name="email"
                type="email"
                label="Email address"
                placeholder="Ex. james@bond.com"
                register={register}
                validations={{
                  required: {
                    value: true,
                    message: 'Please, specify your email address',
                  },
                }}
                error={errors?.email}
              />
              <Input
                name="password"
                type="password"
                label="Password"
                register={register}
                validations={{
                  required: {
                    value: true,
                    message: 'Please, specify your password',
                  },
                }}
                error={errors?.password}
              />

              <Button
                type="submit"
                variant={success ? 'SUCCESS' : undefined}
                isLoading={submitting}
                disabled={submitting || success}
                showCheckOnSuccess
              >
                Sign in
              </Button>
            </form>
            <div className="space-y-8">
              <div
                className="text-center border-b border-gray-200"
                style={{ lineHeight: 0 }}
              >
                <span
                  className="p-2 text-xs font-semibold tracking-wide text-gray-600 uppercase bg-white"
                  style={{ lineHeight: 0 }}
                >
                  OR
                </span>
              </div>
              <div className="w-full">
                <Button variant="GOOGLE" disabled>
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="mr-1"
                    >
                      <path d="M20.283,10.356h-8.327v3.451h4.792c-0.446,2.193-2.313,3.453-4.792,3.453c-2.923,0-5.279-2.356-5.279-5.28	c0-2.923,2.356-5.279,5.279-5.279c1.259,0,2.397,0.447,3.29,1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233	c-4.954,0-8.934,3.979-8.934,8.934c0,4.955,3.979,8.934,8.934,8.934c4.467,0,8.529-3.249,8.529-8.934	C20.485,11.453,20.404,10.884,20.283,10.356z" />
                    </svg>
                    Continue with Google
                  </>
                </Button>
              </div>
            </div>
          </div>
          <p className="mb-4 text-xs text-center text-gray-400">
            <Link href={routes.session.signUp}>
              <a
                href={routes.session.signUp}
                className="text-blue-900 underline hover:text-black"
              >
                Sign up
              </a>
            </Link>
            <span className="mx-1">·</span>
            <Link href={routes.session.requestPassword}>
              <a
                href={routes.session.requestPassword}
                className="text-blue-900 underline hover:text-black"
              >
                Forgot password?
              </a>
            </Link>
            <span className="mx-1">·</span>
            <Link href={routes.legal.privacyTerms}>
              <a
                href={routes.legal.privacyTerms}
                className="text-blue-900 underline hover:text-black"
              >
                Privacy terms
              </a>
            </Link>
          </p>
        </div>
      </section>
    </IsNotAuthenticated>
  )
}

export default SignIn
