# doubly

**Track Every Click. Master Every Metric.**

**Doubly** is a powerful link shortener and analytics platform designed to give you deep insights into how your links are performing. Simply provide a URL, and Doubly generates a smart proxy link. When users click this link, they’re seamlessly redirected to your original destination—while Doubly captures detailed data about the click event.

From device type to geographic location, Doubly collects and organizes valuable metrics, presenting them in a clear, user-friendly dashboard. With intuitive filtering options, you can quickly drill down to the data that matters most. For example, you can effortlessly view how many clicks came from Firefox on Android devices from Mexico, France or anywhere in Asia, in the last 30 days.

Doubly empowers you to make informed decisions based on real user behavior, all in just a few clicks.

## Built With

  - [Next.js](https://nextjs.org/) - Fullstack React framework
  - [Typescript](https://www.typescriptlang.org/) - Javascript with less bugs
  - [Neon](https://neon.tech/) - Serverless Postgres database (note - we do not use any ORMs)
  - [React.js](https://react.dev/) - Frontend library
  - [Better Auth](https://www.better-auth.com/) - Session-based auth library
  - [shadcn/ui](https://ui.shadcn.com/) - Component library
  - [TailwindCSS](https://tailwindcss.com/) - CSS directly in JSX code
  - [React Hook Form](https://react-hook-form.com/) - Simplifies fronend forms
  - [Zod](https://zod.dev/) - Build time type safety and run time validation safety
  - [Nanoid](https://github.com/ai/nanoid) - Used to generate random codes for links
  - [React Table](https://tanstack.com/table/v7) - Library for making frontend tables
  - [Resend](https://resend.com/) - Email sending service
  - [Docker](https://www.docker.com/) - Used for local development with Postgres
  - [Vercel](https://vercel.com/) - Hosting + edge functions

### Local Development

#### Docker + Postgres

This project uses the Neon Postgres for production. For development we can create a Dockerized Postgres by running:

```
docker compose up -d
```

and we can stop it using:

```
docker compose down
```

If you want to delete all local database data, you need to add the `--volumes` flag:

```
docker compose down --volumes
```

For more information checkout [this article](https://neon.tech/guides/local-development-with-neon) by Neon.

