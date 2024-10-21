# Medusa 2 Starter with Remix Storefront

This is a starter project for an e-commerce application using Medusa as the backend and Remix as the storefront, all set up in a Turborepo monorepo structure.

https://github.com/user-attachments/assets/3c10d2f5-91b8-405c-a47c-c8ae8a4be575


## Project Overview

This monorepo includes:

- `medusa`: A Medusa backend application
- `storefront`: A Remix-based storefront application
- Shared packages and configurations

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 20+
- Yarn 4.5.0
- Remix
- Docker and Docker Compose

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   yarn
   ```
3. Test the setup:
   ```
   yarn build
   ```

## Local Development Setup
1. Generate `.env` files for both the Medusa backend and the Remix storefront.
   ```
   yarn run generate-env
   ```
   > This will generate the `apps/medusa/.env` and `apps/storefront/.env` files.

2. Replace the following environment variables in your `apps/medusa/.env` file:
   - `STRIPE_API_KEY` # Your Stripe secret key. Required to checkout.

3. Run the following command to initialize the Medusa database:

   ```
   yarn run medusa:init
   ```

   > This will set up the database and seed it with some initial data, including a user with the email `admin@medusa-test.com` and password `supersecret`.

4. Start the development servers:
   ```
   yarn dev
   ```

   > This will start both the Medusa backend and the Remix storefront in development mode.

5. Create a Publishable API Key for your storefront:

   - Log in to the [Medusa admin](http://localhost:9000/app/login) using the credentials `admin@medusa-test.com` / `supersecret`

   - Navigate to the [_Publishable API Keys_ settings](http://localhost:9000/app/settings/publishable-api-keys) and **copy** an exisiting API Key or create a new one with at least one Sales Channel.

6. Replace the environment variables in the `apps/storefront/.env` file:

   - `MEDUSA_PUBLISHABLE_KEY` # API key from previous step
   - `STRIPE_PUBLIC_KEY` # starts with `pk_`
   - `STRIPE_SECRET_KEY` # starts with `sk_`

7. Restart the Remix server:
      ```
      yarn dev
      ```


## Resetting the Database
In order to reset the database, follow the steps from 4 to 6 in the Local Development Setup section.

## Useful Links

- [Medusa Documentation](https://docs.medusajs.com/)
- [Remix Documentation](https://remix.run/docs/en/main)
- [Turborepo Documentation](https://turbo.build/repo/docs)
