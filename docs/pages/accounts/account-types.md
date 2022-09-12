---
title: Account Types
---

## Personal Accounts

Every user of Expo has their own Personal Account. With this account, we can safely identify you as the developer or owner of an app. You can use Personal Accounts for all features Expo has to offer. In cases where you take an action that doesn't specify which account it should belong to, it will default to your Personal Account

This account is just for you, **never share access to this account for any reason.**

## Organizations

If you are creating a project that may need to outlive your involvement with it, for instance a professional project for a company you work for, we recommend you create a new Organization for that project.

Common situations where Organizations are useful:

- Transferring control of a project
- Sharing access with others
- Isolating expenses for work projects that you need to submit expenses for
- Structuring projects for different contexts (e.g. work for different clients)

|                                                                     | Personal Accounts | Organization |
| ------------------------------------------------------------------- | ----------------- | ------------ |
| **Create Projects**                                                 | X                 | X            |
| **Build projects to submit to App Store and Play Store**            | X                 | X            |
| **Release bug fixes with updates**                                  | X                 | X            |
| **Transfer control of individual projects to another user**         | Beta              | Beta         |
| **Transfer control of all projects to another user**                |                   | X            |
| **Programmatic access with limited privileges**                     |                   | X            |
| **Designate multiple users who have complete control of a project** |                   | X            |

### Creating New Organizations

To create a new Organization, visit [expo.dev/create-organization](https://expo.dev/create-organization) and sign in to your Personal Account.
You can also create a new Organization by selecting "New Organization" from the account selection dropdown at the top of your dashboard.

You'll need to choose a name for your Organization. Once you have created the organization, you will not be able to rename it.
To associate projects with an Organization, you will need to add the [Owner key](/versions/latest/config/app/#owner) to your project's app.json

### Converting Personal Accounts into Organizations

If you have projects under a Personal Account that you would rather have as an Organization, it is simple and safe to convert to any project created under your Personal Account to an Organization. Simply visit [expo.dev/settings](https://expo.dev/settings) and follow the prompts under **Convert your account into an Organization**.

You will need to assign a Personal Account to manage the Organization as part of this process (You can create a new one if you don't already have another account).

We have taken a lot of care to make sure that all of the functionality that you and your users rely on will continue work as expected, meaning:

- You can continue to deliver updates and push notifications to your users.
- You will still be able to use any iOS or Android credentials stored on Expo's servers.
- Any integrations using your personal access token or webhooks will continue to operate.
- Your subscription to Developer Services will continue without interruption.
- Your production apps will continue to operate without interruption.

### Renaming an Account

> ⚠️ This feature is in private beta, please email secure@expo.dev with the name of the Personal Account or Organization you would like to rename to get access.

If you aren't happy with the name you originally chose for your account, you may choose a new name a limited number of times. Simply visit [the account settings page](https://expo.dev/accounts/[account]/settings) and follow the prompts under **Rename Account**.

### Transferring Projects Between Accounts

> ⚠️ This feature is in private beta, please email secure@expo.dev with the names of the Personal Accounts or Organizations you would like to transfer the project to and from to get access.

If you need to transfer a project between your Personal Account or Organzions you are an Owner of, you can do so by visiting [the project overview page](https://expo.dev/accounts/[account]/projects/[project]) and following the prompts under **Transfer Project**.

> 💡 If you need to transfer a project from your account (`source`) to an Organization (`destination`) you are not the Owner of, you can create a new Organization (`escrow`) to complete the transfer without Owner access on the destination account. You can add the Owner to the `destination` account can safely share Owner access on the `escrow` account.
