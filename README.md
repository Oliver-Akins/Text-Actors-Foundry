# Text-Based Actors
This is an intentionally bare-bones system that features a text-only character
sheet, allowing the playing of games that may not otherwise have a Foundry system
implementation.

## Features
There are not too many features included in this system for things like automation
as it's meant to be used to mostly play rules-light games. However there are some
special features that can be enabled on a per-world basis using a world script
to enable feature flags that you want.

### List of Feature Flags
| Flag | Description
| - | -
| `ROLL_MODE_CONTENT` | Allows players, GMs, and macros to send "blind" chat messages where only the GM gets to see the content.
| `STORABLE_SHEET_SIZE` | Makes it so that certain sheets are able to have their size saved, so that it resumes that size when opened.

### Example Feature Flag
In order to change these flags, you must make a world script that has something
like the below code in it:

```js
//           v- this is the name of the flag from the table above
taf.FEATURES.STORABLE_SHEET_SIZE = true;
```