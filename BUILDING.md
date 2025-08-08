# Build and Publish Guide

This document explains how to build the Azure DevOps extension (VSIX) and publish it to the Marketplace or your organization.

## Prerequisites

- Node.js 20+
- npm 8+
- Git
- Azure DevOps publisher account (e.g., `NicoDGK`) with rights to publish the extension
- Personal Access Token (PAT) for publishing via CLI (scope: `Marketplace (Publish)` / `vso.extension_publish`)

Optional (for CLI publish):
- `tfx-cli` via npx (preferred) or global install

## Install dependencies and build the task

The task lives in `buildandreleasetask/`.

```bash
# From repo root
npm ci --prefix buildandreleasetask
npm run build --prefix buildandreleasetask
```

This compiles TypeScript to `buildandreleasetask/index.js` using Node 20.

## Bump versions

Before packaging, bump versions so the Marketplace accepts the upload.

- `buildandreleasetask/task.json` → `version.{Major,Minor,Patch}`
- `vss-extension.json` → `version`

Keep versions in these files aligned. Commit your changes.

```bash
git add buildandreleasetask/task.json vss-extension.json
git commit -m "Bump extension and task versions"
```

## Package the VSIX

Create the VSIX using `tfx-cli`.

```bash
# From repo root
mkdir -p dist
npx --yes tfx-cli extension create \
  --manifest-globs vss-extension.json \
  --output-path dist
```

Output example:
- `dist/<publisher>.<extension-id>-<version>.vsix`

## Publish to the Marketplace (UI)

- Go to `https://marketplace.visualstudio.com/manage/publishers/<publisher>`
- Click "New Extension" → "Azure DevOps"
- Upload the generated VSIX from `dist/`
- Fill in any required metadata and publish (or share privately)

## Publish to an organization gallery (UI)

- Go to `https://dev.azure.com/<your-org>/_gallery/manage`
- Click "Upload extension"
- Choose the VSIX from `dist/`
- Share with your organization if not public

## Publish via CLI (optional)

First, create a PAT with `Marketplace (Publish)` scope. Then run:

```bash
# Authenticate once per session
npx --yes tfx-cli login --service-url https://marketplace.visualstudio.com \
  --token <YOUR_PAT>

# Publish using the VSIX file
npx --yes tfx-cli extension publish \
  --vsix dist/<publisher>.<extension-id>-<version>.vsix \
  --publisher <publisher>

# Or publish directly from the manifest (requires version bump each time)
npx --yes tfx-cli extension publish \
  --manifest-globs vss-extension.json \
  --publisher <publisher>
```

To share the extension with an organization via CLI:

```bash
npx --yes tfx-cli extension share \
  --publisher <publisher> \
  --extension-id <extension-id> \
  --share-with <your-org>
```

## Notes

- This task targets only the Node 20 handler (`Node20`). Ensure your build agents are Node 20-capable (Microsoft-hosted agents are.)
- Minimum agent version is set accordingly in `buildandreleasetask/task.json`.
- If you change inputs or behavior, update `README.md` and bump versions before packaging.
- For testing, upload to your org gallery first, run a pipeline, and verify no Node 16 EOL warnings appear.
