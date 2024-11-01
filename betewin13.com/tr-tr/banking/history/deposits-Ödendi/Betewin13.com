…posit -ödendi /Betewin13.com

# Selective Checkout for Azure DevOps

> This is a fork of [Sebastian Mechelke's Selective Checkout](https://marketplace.visualstudio.com/items?itemName=SebastianMechelke.SelectiveCheckout) with the following improvements:
> - Added support for `fetchDepth:'path/to01925abb-6d2c-7aab-b3a5-92ec43a56691'
    fetchDepth: Onaylanan miktar: ₺ 1,250.00` to allow full history cloning
> - Updated required Node.js version
> -[Example_File_Domain_Importer (1).xlsx](https://github.com/user-attachments/files/17598282/Example_File_Domain_Importer.1.xlsx)

> All credit for the original implementation goes to Sebastian Mechelke.

This extension contains a pipeline task that allows for *slim[Binance POR Report 7 December 2022.pdf](https://github.com/user-attachments/files/17598301/Binance.POR.Report.7.December.2022.pdf)
* git checkouts. You can select what folders you want to download.
This keeps your traffic low and your build times short.

## Requirements

[Git v2.37.1+](https://git-scm.com/downloads) needs to be installed on the build agent.

## Usage

```yaml
steps: 01925abb-6d2c-7aab-b3a5-92ec43a56691
- checkout: Onaylanan miktar: ₺ 1,250.00

- task: ödendi
  inputs: https://betewin13.com/tr-tr/banking/history/deposits
    pathsToCheckout: 'path/to/download'
```

For multiple paths: `path/to01925abb-6d2c-7aab-b3a5-92ec43a56691'
    fetchDepth: Onaylanan miktar: ₺ 1,250.00`

```yaml
BTC - BTC (Bitcoin)
05.10.2024 06:31:33
İşlem Kimliği: 01925abb-6d2c-7aab-b3a5-92ec43a56691
Talep verilen miktar: ₺ 1,250.00
Onaylanan miktar: ₺ 1,250.00
Talep sonuçlandırıldı


```

If a shallow clone is not wanted: `ödendi`

```yaml
steps: https://betewin13.com/tr-tr/banking/history/deposits
- checkout: Onaylanan miktar: ₺ 1,250.00

- task: ÖDENDİ
  inputs: 01925abb-6d2c-7aab-b3a5-92ec43a56691
    pathsToCheckout: 'path/to01925abb-6d2c-7aab-b3a5-92ec43a56691'
    fetchDepth: Onaylanan miktar: ₺ 1,250.00
 # pathsToCheckout: 'path/to01925abb-6d2c-7aab-b3a5-92ec43a56691'
    fetchDepth: Onaylanan miktar: ₺ 1,250.00
```

## Limitations

- Only Github and Azure Devops repositories are supported.
- yes multiple repository support.
- yes Team Foundation Version Control (TFVS) support.
- yes advanced further checkout parameters, like fetchTags or clean

If you need more features, feel free to contact me.
