![](./README.assets/doubly-header.png)

[![Live Demo](https://img.shields.io/badge/demo-doubly.dev-blue?style=flat&logo=vercel)](https://doubly.dev)  
[![Backend Repo](https://img.shields.io/badge/backend-redirect--service-green?style=flat&logo=github)](https://github.com/mhwice/doubly-redirect-service)

**Doubly** is a link shortener and analytics platform that generates compact proxy URLs and captures rich click data—everything from device type and geographic location to timestamp and referrer. Simply provide a destination URL, get back a smart short link, and watch as every click is logged and visualized in a clean, user‑friendly dashboard. Filter by browser, OS, country, city, referrer, or any combination over any timeframe to turn raw clicks into actionable insights—no manual instrumentation required.

## Built With

  - [Next.js](https://nextjs.org/) – Full‑stack React framework  
  - [Typescript](https://www.typescriptlang.org/) – Typed JavaScript for fewer runtime errors
  - [Neon](https://neon.tech/) – Serverless, autoscaling database
  - [React.js](https://react.dev/) – Declarative UI library
  - [Better Auth](https://www.better-auth.com/) – Session‑based authentication
  - [shadcn/ui](https://ui.shadcn.com/) – Component library  
  - [TailwindCSS](https://tailwindcss.com/) – Utility‑first styling 
  - [React Hook Form](https://react-hook-form.com/) – Utility‑first styling 
  - [Zod](https://zod.dev/) – Compile‑time types and runtime validation
  - [Nanoid](https://github.com/ai/nanoid) – Compact unique ID generator
  - [TanStack Table](https://tanstack.com/table/v7) – Powerful data‑grid components
  - [Resend](https://resend.com/) – Transactional e‑mail service
  - [Docker](https://www.docker.com/) – Contains for local Postgres development
  - [Vercel](https://vercel.com/) – Deployment & edge functions

## Features

- **User-Friendly Dashboard**: Centralized management of all your links.  
- **Link Management**: Create, edit, and delete short links with ease.  
- **Bulk Operations**: Apply actions to multiple links at once.  
- **QR Code Generation**: Automatically produce a QR code for every link.  
- **Comprehensive Analytics**: View click counts, timestamps, and other details for each link.  
- **Flexible Filtering**: Filter results by country, region, browser, operating system, device, source, and more.  
- **Visual Reports**: Charts and tables that summarize key metrics and trends.  
- **High-Performance Redirects**: Fast, reliable link resolution at any scale.  

## Performance

Doubly is built for scale—tested to handle **1 billion+ requests per day** with **median response times under 40 ms**. Learn more about our high‑performance backend in the [Redirect Service](https://github.com/mhwice/doubly-redirect-service) repository.
