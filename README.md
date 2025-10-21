# Battlefield 6 Portal Firing Range

A custom firing range experience for Battlefield Portal that provides weapon testing and training capabilities.

## Setup

Install the required dependencies:

```bash
npm install
```

## Building

To build the project for use in Battlefield Portal:

```bash
npm run build
```

This will generate the following files in the `dist` folder:
- `Script.ts` - The main Portal script
- `Strings.json` - Localization strings

## Usage in Battlefield Portal

1. Run `npm run build` to generate the output files
2. Copy the contents of `dist/Script.ts` into the Battlefield Portal editor's script section
3. Import the `dist/Strings.json` file for localized text strings
4. Configure your Portal experience settings as needed

The firing range will provide weapon testing capabilities and training features for players in your Portal experience.