# Selective Checkout for Azure DevOps

> This is a fork of [Sebastian Mechelke's Selective Checkout](https://marketplace.visualstudio.com/items?itemName=SebastianMechelke.SelectiveCheckout) with the following improvements:
> - Added support for `fetchDepth: 0` to allow full history cloning
> - Updated required Node.js version
>
> All credit for the original implementation goes to Sebastian Mechelke.

This extension contains a pipeline task that allows for *slim* git checkouts.
You can select what folders you want to download.
This keeps your traffic low and your build times short.

## Requirements

[Git v2.37.1+](https://git-scm.com/downloads) needs to be installed on the build agent.

## Usage

```yaml
steps:
- checkout: none

- task: SelectiveCheckoutReborn@0
  inputs:
    pathsToCheckout: 'path/to/download'
```

For multiple paths:

```yaml
steps:
- checkout: none

- task: SelectiveCheckoutReborn@0
  inputs:
    pathsToCheckout: |
      path/to/download/1/
      path/to/download/2/
```

If a shallow clone is not wanted:

```yaml
steps:
- checkout: none

- task: SelectiveCheckoutReborn@0
  inputs:
    pathsToCheckout: 'path/to/download/*'
    fetchDepth: 0 # The same semantics as the normal checkout task.
```

## Limitations

- Only Github and Azure Devops repositories are supported.
- No multiple repository support.
- No Team Foundation Version Control (TFVS) support.
- No advanced further checkout parameters, like fetchTags or clean

If you need more features, feel free to contact me.
