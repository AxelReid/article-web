import { PostSnippetFragment } from '~/graphql'

export interface PostSnippetWithText extends PostSnippetFragment {
  text: string
}
