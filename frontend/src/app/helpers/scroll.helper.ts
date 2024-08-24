export function scrollToBottom(target: HTMLDivElement | null) {
  target?.scrollTo({
    top: target?.scrollHeight,
    behavior: 'smooth',
  });
}
