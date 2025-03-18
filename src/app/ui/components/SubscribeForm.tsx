import React, { FormEvent, useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div>
      <form className='space-y-2' onSubmit={handleSubmit}>
        <input
          type='email'
          placeholder='Enter your email'
          className='w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
          aria-label='Email for newsletter'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type='submit'
          className='w-full bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors'
          aria-label='Subscribe to newsletter'
        >
          Subscribe
        </button>
        {message && <p className='text-sm text-muted-foreground'>{message}</p>}
      </form>
    </div>
  );
}
