
import dotenv from "dotenv"
dotenv.config();
import { intro, confirm, isCancel } from "@clack/prompts";
import { createAuthClient } from "better-auth/client";
import { deviceAuthorizationClient } from "better-auth/client/plugins";
import { logger } from "better-auth";

import chalk from "chalk";
import { Command } from "commander";
import open from "open";
import os from "os";
import path from "path";
import yoctoSpinner from "yocto-spinner";
import * as z from "zod";




/* =============================================
   CONSTANTS (Option A)
============================================= */

const DEFAULT_SERVER_URL = "http://localhost:3005";
const CLIENT_ID = process.env.BETTER_AUTH_CLIENT_ID; 
const CONFIG_DIR = path.join(os.homedir(), ".orbital");
const TOKEN_FILE = path.join(CONFIG_DIR, "token.json");

/* =============================================
   SCHEMA
============================================= */

const optionsSchema = z.object({
  serverUrl: z.string().optional(),
  clientId: z.string().optional(),
});

/* =============================================
   ACTION
============================================= */

export async function loginAction(opts) {
  const options = optionsSchema.parse(opts);

  const serverUrl = options.serverUrl ?? DEFAULT_SERVER_URL;
  const clientId = options.clientId ?? CLIENT_ID;
  console.log("ENV CHECK:", process.env.BETTER_AUTH_CLIENT_ID);



  if (!clientId) {
    console.log(
      chalk.red(
        "\n❌ BETTER_AUTH_CLIENT_ID not found.\n" +
        "Set it in your .env file before running login.\n"
      )
    );
    process.exit(1);
  }

  intro(chalk.bold("🔐 Orbital CLI Login"));

  const authClient = createAuthClient({
    baseURL: serverUrl,
    plugins: [deviceAuthorizationClient()],
  });

  const spinner = yoctoSpinner({
    text: "Requesting device authorization...",
  }).start();

  try {
    const { data, error } = await authClient.device.code({
        client_id: clientId,
        scope: "openid profile email",
      });
      
    spinner.stop();

    if (error || !data) {
      logger.error(
        error?.error_description || "Failed to start device authorization"
      );
      process.exit(1);
    }

    const {
      user_code,
      verification_uri,
      verification_uri_complete,
      expires_in,
    } = data;

    console.log(chalk.cyan("\nDevice authorization required\n"));

    console.log(
      `Visit: ${chalk.underline.blue(
        verification_uri_complete || verification_uri
      )}`
    );
    console.log(`Code: ${chalk.bold.green(user_code)}\n`);

    const shouldOpen = await confirm({
      message: "Open browser automatically?",
      initialValue: true,
    });

    if (!isCancel(shouldOpen) && shouldOpen) {
      await open(verification_uri_complete || verification_uri);
    }

    console.log(
      chalk.gray(
        `Waiting for authorization (expires in ${Math.floor(
          expires_in / 60
        )} minutes)...`
      )
    );

    // 🔜 NEXT STEP:
    // authClient.device.token(...)
    // save token to TOKEN_FILE

  } catch (err) {
    spinner.stop();
    logger.error(err);
    process.exit(1);
  }
}

/* =============================================
   COMMAND
============================================= */

export const login = new Command("login")
  .description("Login using device authorization flow")
  .option("--server-url <url>", "Better Auth server URL")
  .option("--client-id <id>", "OAuth client ID override")
  .action(loginAction);
