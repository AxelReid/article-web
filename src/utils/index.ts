export const formatGqlErrorMsg = (gqlErrMsg: string) =>
  gqlErrMsg?.replace('[GraphQL]', '').trim()
