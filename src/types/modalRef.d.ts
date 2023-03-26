type ModalRefTypes<T> = {
  open: (args?: T) => void
  close: () => void
  opened: boolean
} | null

export type ModalMutableRefProps<T = undefined> = React.MutableRefObject<
  ModalRefTypes<T>
>
