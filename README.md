# In C - Score Progress

This is a simple Electron app for displaying score progress on a projector
during laptop performances of [Terry Riley's *In C*][inC]. It is designed to be
used with [Max][max], but it could be used with other software (let me know if
you do!). Supports Windows, macOS, and Linux.

![screenshot](img/screenshot.png "In C - In Action")

## Usage

This app works by having each performer report a identification number unique
to their computer and the phrase they are currently performing. In Max this is
sent as a list of two integers, specifically the ID number followed by the
phrase number. All messages should be sent to port number `41234` on the
computer hosting this app. Below is an example Max patch that sends a message
to the correct port on your local machine, assuming you are hosting the app:

![max-patch](img/max-patch.png "Example Max patch for communicating with this app")

## Downloads

TODO

## About

Created for the Loyola University (Chicago) Technology Ensemble. Fall 2016

[License](LICENSE.md)

[inC]: https://en.wikipedia.org/wiki/In_C
[max]: https://cycling74.com/max7/
