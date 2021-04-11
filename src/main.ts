import { ConsoleUI } from "./controller/console/console";

async function bootstrap() {

    let statePath = process.argv.length > 2 && process.argv[2]
    let passengersPath = process.argv.length > 3 && process.argv[3]

    statePath && passengersPath ? new ConsoleUI().run(statePath, passengersPath)
        : statePath ? new ConsoleUI().run(statePath)
            : console.log("the path cannot be empty!");
}

bootstrap()
