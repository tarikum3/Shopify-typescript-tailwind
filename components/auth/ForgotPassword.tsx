import { FC, useEffect, useState, useCallback } from 'react'
import { validate } from 'email-validator'
import { useUI } from '@components/context'
import { Logo, Button, Input } from '@components'

const ForgotPassword: FC = () => {
  // Form State
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [dirty, setDirty] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const { setModalView } = useUI()

  const handleResetPassword = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault()

    if (!dirty && !disabled) {
      setDirty(true)
      handleValidation()
    }
  }

  const handleValidation = useCallback(() => {
    // Unable to send form unless fields are valid.
    if (dirty) {
      setDisabled(!validate(email))
    }
  }, [email, dirty])

  useEffect(() => {
    handleValidation()
  }, [handleValidation])

  return (
    <form
      onSubmit={handleResetPassword}
      className="w-80 flex flex-col justify-between p-3 border rounded-lg "
    >
      <div className="flex justify-center pb-12 ">
        <Logo width="64px" height="64px" />
      </div>
      <div className="flex flex-col space-y-4">
        {message && (
          <div className="text-red border border-red p-3">{message}</div>
        )}

        <Input placeholder="Email" onChange={setEmail} type="email" />
        <div className="pt-2 w-full flex flex-col">
          <Button
            type="submit"
            loading={loading}
            disabled={disabled}
          >
            Recover Password
          </Button>
        </div>

        <span className="pt-3 text-center text-sm">
          <span className="text-secondary-3">Do you have an account?</span>
          {` `}
          <a
            className="text-secondary font-bold hover:underline cursor-pointer"
            onClick={() => setModalView('LOGIN_VIEW')}
          >
            Log In
          </a>
        </span>
      </div>
    </form>
  )
}

export default ForgotPassword
