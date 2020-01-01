export const mapGHReactionToEmoji = reaction => {
  switch (reaction) {
    case 'THUMBS_UP':
      return '👍'
    case 'THUMBS_DOWN':
      return '👎'
    case 'LAUGH':
      return '😆'
    case 'HOORAY':
      return '🎉'
    case 'CONFUSED':
      return '😕'
    case 'HEART':
      return '💖'
    case 'ROCKET':
      return '🚀'
    case 'eyes':
      return '👀'
    default:
      return ''
  }
}
