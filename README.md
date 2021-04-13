# Lift Travel Plan

### Based on Clean Architecture and design pattern with typescript nodejs

## Description
This is for simulation lift travel plan that is developed on nodejs typescript command line program that prints out the travel plan of the lift according to the states of the lift and passengers.

## Installation

```bash
$ npm install
```
## Running the app
```
$ npm run plan path-to-state-file
```
for example: npm run plan C:/Users/Komil/source/repos/interviews/lift-travel-plan/files/states/state_9.hcl

## Inputs

There are 2 files that you need for this question
 - [passengers.csv](https://s3-ap-southeast-1.amazonaws.com/static.propine.com/passengers.csv)
 - [states.zip](https://s3-ap-southeast-1.amazonaws.com/static.propine.com/states.zip)

### Passenger information
Passengers [CSV](https://s3-ap-southeast-1.amazonaws.com/static.propine.com/passengers.csv) file which describes the passengers for the lift. Each row corresponds to one passenger. There are 25 passengers in total.

 - id: The identification for the passenger.
 - health: The health state of the passenger. They are either healthy or disabled.
 - age: The age of the passenger. Age 12 and below is regarded as children.
 - family_id: If the family_id is the same, the passengers belong to the same family. People not from the same family are regarded as strangers.

### Lift states

Lift states are the starting state for a distinct scenario. There are 10 state files included in the [states.zip](https://s3-ap-southeast-1.amazonaws.com/static.propine.com/states.zip) file which describes the starting state of the lift and passengers. The file are in [HCL](https://github.com/hashicorp/hcl) format. Each file contains 2 types of clauses: passenger and lift.

``` hcl
passenger {
  id = 21
  goto_level = 7
  at_level = 1
}
```

The passenger clause starts with the keyword `passenger`. The example means passenger id 21 is currently at level 1, and wants to go to level 7.

``` hcl
lift {
  id = 1
  at_level = 8
}
```

The lift clause starts with the keyword `lift`. The example means lift id 1 is at level 8.

You may assume all the passengers pressed the lift button at the same time.

## Expected Output

The travel plan should follow the shortest path algorithm, which follows the simple heuristic where the lift will go to the nearest passenger first and move in the same direction and stop to collect or alight passengers.

The program should output a list of travel instructions for each of the 10 scenarios as defined in the 10 state files. The lift will follow the instructions in order from top to bottom. An instruction follows the format below

```
LIFT <LIFT_ID>: <COMMAND>
```

`LIFT_ID` denotes the lift id from the lift state clauses. Assume each lift can fit a maximum of **3** persons. At the start they are stationary and empty.

The commands are
 - `STOP <LEVEL>`: Tells the lift to stop at a level. `LEVEL` is an integer
 - `GO <UP|DOWN>`: Tells the lift to move in a direction. The valid values are `UP` or `DOWN`
 - `PASSENGER <PASSENGER_ID> <ENTER|LEAVE>`: Tells the passenger to enter or leave. `PASSENGER_ID` refers to the id of the passenger as defined in the state file. The valid values are `ENTER` or `LEAVE`

Following a `GO` command, the next command must be a `STOP` command.

Following a `STOP` command, the next command must be a `GO` or `PASSENGER` command, or nothing should follow if it is the last instruction.

The ground floor is standardised as level 1.

The last instruction must be a return to the ground floor where it stops at level 1. In a multi lift scenario, print out instructions for the first lift, followed by a blank line, then print out instructions for the following lifts.

An example instruction is shown below

```
LIFT 1: GO DOWN
LIFT 1: STOP 1
LIFT 1: PASSENGER 1 ENTER
LIFT 1: PASSENGER 2 ENTER
LIFT 1: GO UP
LIFT 1: STOP 10
LIFT 1: PASSENGER 2 LEAVE
LIFT 1: GO UP
LIFT 1: STOP 17
LIFT 1: PASSENGER 1 LEAVE
LIFT 1: GO DOWN
LIFT 1: STOP 1

LIFT 2: GO UP
LIFT 2: STOP 2
LIFT 2: PASSENGER 3 ENTER
LIFT 2: GO UP
LIFT 2: STOP 4
LIFT 2: PASSENGER 3 LEAVE
LIFT 2: GO DOWN
LIFT 2: STOP 1
```

## Clean Architecture
![Lift Travel Plan (5)](https://user-images.githubusercontent.com/16934572/114427575-ccc5c680-9bed-11eb-8155-ee03921b5a53.png)
