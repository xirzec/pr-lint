# PR Lint JS Action

This action lints Pull Requests for correctness by checking the body and title.

## Inputs

### `repo-token`

**Required** The GitHub token to use for authentication.

### `required-sections`

If there are particular body sections (markdown headings) to require being present. Checks are made using `startsWith` so you don't need to write out the entire header.

## Outputs

### `errors`

A `JSON.stringify`'d array of issues detected with the given pull request.

## Example usage

```yaml
# This removes all unnecessary permissions, the ones needed will be set below.
# https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token
permissions: {}

jobs:
  lint-pr:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - uses: xirzec/pr-lint@v1
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```
