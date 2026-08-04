"use client";

import Container from "@/components/container";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useWeb3Forms from "@web3forms/react";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { SITE_NAME } from "@/lib/seo";
import { cx } from "@/utils/all";
import { RuneFlourish } from "@/components/ui/runes";

export default function Contact({ settings }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitSuccessful, isSubmitting }
  } = useForm({
    mode: "onTouched"
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState(false);
  const apiKey = settings?.w3ckey || process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

  const { submit: onSubmit } = useWeb3Forms({
    access_key: apiKey,
    settings: {
      from_name: SITE_NAME,
      subject: `New Contact Message from ${SITE_NAME}`
    },
    onSuccess: (msg, data) => {
      setIsSuccess(true);
      setMessage(msg);
      reset();
    },
    onError: (msg, data) => {
      setIsSuccess(false);
      setMessage(msg);
    }
  });

  return (
    <>
      <header className="relative isolate overflow-hidden pb-14 pt-20">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-aurora-deep/40 via-night to-night"
        />
        <RuneFlourish side="right" />

        <Container className="text-center">
          <p className="kicker">Say hello</p>
          <h1 className="mt-4 font-serif text-4xl font-normal leading-[1.1] tracking-tight text-frost-light sm:text-5xl lg:text-6xl">
            Contact
          </h1>
          <p className="mt-5 text-[0.975rem] text-mist-dim">
            We are a here to help.
          </p>
        </Container>
      </header>

      <Container alt className="pb-24">
        <div className="grid gap-14 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="font-serif text-3xl font-normal tracking-tight text-frost-light lg:text-4xl">
              Contact {SITE_NAME}
            </h2>
            <p className="mt-5 max-w-sm leading-relaxed text-mist-dim">
              Have something to say? We are here to help. Fill up the form or
              send us an email.
            </p>

            <div className="mt-7">
              {settings?.email && (
                <div className="flex items-center space-x-2.5 text-mist-dim">
                  <EnvelopeIcon className="h-4 w-4 text-bronze" />
                  <a
                    href={`mailto:${settings.email}`}
                    className="transition-colors hover:text-bronze">
                    {settings.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="checkbox"
                id=""
                className="hidden"
                style={{ display: "none" }}
                {...register("botcheck")}></input>

              <div className="mb-5">
                <input
                  type="text"
                  placeholder="Full Name"
                  autoComplete="false"
                  className={cx("field", errors.name && "field-error")}
                  {...register("name", {
                    required: "Full name is required",
                    maxLength: 80
                  })}
                />
                {errors.name && (
                  <div className="mt-1.5 text-red-400">
                    <small>{errors.name.message}</small>
                  </div>
                )}
              </div>

              <div className="mb-5">
                <label htmlFor="email_address" className="sr-only">
                  Email Address
                </label>
                <input
                  id="email_address"
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  autoComplete="false"
                  className={cx("field", errors.email && "field-error")}
                  {...register("email", {
                    required: "Enter your email",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Please enter a valid email"
                    }
                  })}
                />
                {errors.email && (
                  <div className="mt-1.5 text-red-400">
                    <small>{errors.email.message}</small>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  className={cx(
                    "field h-36",
                    errors.message && "field-error"
                  )}
                  {...register("message", {
                    required: "Enter your Message"
                  })}
                />
                {errors.message && (
                  <div className="mt-1.5 text-red-400">
                    {" "}
                    <small>{errors.message.message}</small>
                  </div>
                )}
              </div>

              <button type="submit" className="btn-bronze w-full py-4">
                {isSubmitting ? (
                  <svg
                    className="mx-auto h-5 w-5 animate-spin text-night"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>

            {isSubmitSuccessful && isSuccess && (
              <div className="mt-4 text-center text-sm text-aurora-light">
                {message || "Success. Message sent successfully"}
              </div>
            )}
            {isSubmitSuccessful && !isSuccess && (
              <div className="mt-4 text-center text-sm text-red-400">
                {message || "Something went wrong. Please try later."}
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
