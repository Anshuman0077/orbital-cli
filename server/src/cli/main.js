#!/usr/bin/env node

import dotenv from "dotenv"
import chalk from "chalk"
import figlet from "figlet"
import { Command } from "commander"
import { login } from "./commands/auth/login.js";

dotenv.config();

/**
 * Initialize and run the Orbital CLI: render ASCII banner, print description, register commands, and parse CLI arguments.
 *
 * Registers the `login` subcommand, sets program metadata (name, version, description), shows help when no subcommand is provided, and parses process.argv.
 */
async function main() {
    // Display banner
    console.log(
        chalk.cyan(
            figlet.textSync("Orbital CLI", {
                font: "Standard",
                horizontalLayout: "default"
            })
        )
    );

    console.log(chalk.gray("A CLI based AI Tool\n"));

    const program = new Command("orbitals");

    program
        .version("0.0.1")
        .description("Orbital CLI - A CLI Based AI Tool")
        .addCommand(login)

    program.action(() => {
        program.help();
    });

    program.parse(process.argv);
}

main().catch((err) => {
    console.error(chalk.red("Error running Orbital CLI:"), err);
    process.exit(1);
});