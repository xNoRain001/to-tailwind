const stylesMap = {
  width: 'w',
  height: 'h',
  opacity: 'opacity',
  padding: 'p',
  'padding-top': 'pt',
  'padding-right': 'pr',
  'padding-bottom': 'pb',
  'padding-left': 'pl',
  margin: 'm',
  'margin-top': 'mt',
  'margin-right': 'mr',
  'margin-bottom': 'mb',
  'margin-left': 'ml',
  top: 't',
  right: 'r',
  bottom: 'b',
  left: 'l',
  'border-radius': 'rounded',
  color: 'text',
  'font-size': 'text',
  'background-color': 'bg',
  'min-width': 'min-w',
  'line-height': 'leading',
  'flex-wrap': 'wrap',
  'z-index': 'z',
  'font-weight': {
    100: 'font-thin',
    200: 'font-extra-light',
    300: 'font-light',
    400: 'font-normal',
    500: 'font-medium',
    600: 'font-semibold',
    700: 'font-bold',
    800: 'font-extrabold',
    900: 'font-black'
  },
  position: {
    static: 'static',
    absolute: 'absolute',
    relative: 'relative',
    sticky: 'sticky',
    fixed: 'fixed'
  },
  cursor: {
    auto: 'cursor-auto',
    default: 'cursor-default',
    pointer: 'cursor-pointer',
    wait: 'cursor-wait',
    text: 'cursor-text',
    move: 'cursor-move',
    help: 'cursor-help',
    'not-allowed': 'cursor-not-allowed',
  },
  display: {
    block: 'block',
    'inline-block': 'inline-block',
    inline: 'inline',
    flex:	'flex',
    'inline-flex': 'inline-flex',
    table: 'table',
    'inline-table': 'inline-table',
    'table-caption': 'table-caption',
    'table-cell': 'table-cell',
    'table-column': 'table-column',
    'table-column-group': 'table-column-group',
    'table-footer-group': 'table-footer-group',
    'table-header-group': 'table-header-group',
    'table-row-group': 'table-row-group',
    'table-row': 'table-row',
    'flow-root': 'flow-root',
    grid: 'grid',
    'inline-grid': 'inline-grid',
    contents: 'contents',
    'list-item': 'list-item',
    hidden: 'none'
  },
  float: {
    right: 'float-right',
    left: 'float-left',
    none: 'float-none'
  },
  'justify-content': {
    'flex-start': 'justify-start',
    'flex-end': 'justify-end',
    center: 'justify-center',
    'space-between': 'justify-between',
    'space-around': 'justify-around',
    'space-evenly': 'justify-evenly'
  },
  'align-items': {
    'flex-start': 'items-start',
    'flex-end': 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
  },
  'flex-direction': {
    row: 'flex-row',
    'row-reverse': 'flex-row-reverse',
    column: 'flex-col',
    'column-reverse': 'flex-col-reverse'
  },
  'box-sizing': {
    'border-box': 'box-border',
    'content-box': 'box-content'
  },
  'white-space': {
    normal: 'white-space-normal',
    nowrap: 'white-space-nowrap',
    pre: 'white-space-pre',
    'pre-line': 'white-space-pre-line',
    'pre-wrap': 'white-space-pre-wrap'
  },
  overflow: {
    auto: 'overflow-auto',
    hidden: 'overflow-hidden',
    visible: 'overflow-visible',
    scroll: 'overflow-scroll',
  },
  'overflow-x': {
    auto: 'overflow-x-auto',
    hidden: 'overflow-x-hidden',
    visible: 'overflow-x-visible',
    scroll: 'overflow-x-scroll',
  },
  'overflow-y': {
    auto: 'overflow-y-auto',
    hidden: 'overflow-y-hidden',
    visible: 'overflow-y-visible',
    scroll: 'overflow-y-scroll',
  },
  visibility: {
    visible: 'visible',
    hidden: 'invisible',
    collapse: 'collapse'
  },
  'text-align': {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  },
  'background-position': {
    bottom: 'bg-bottom',
    center: 'bg-center',
    left: 'bg-left',
    'left bottom': 'bg-left-bottom',
    'left top': 'bg-left-top',
    right: 'bg-right',
    'right bottom': 'bg-right-bottom',
    'right top': 'bg-right-top',
    top: 'bg-top'
  },
  'background-repeat': {
    repeat: 'bg-repeat',
    'no-repeat': 'bg-no-repeat',
    'repeat-x': 'bg-repeat-x',
    'repeat-y': 'bg-repeat-y',
    round: 'bg-repeat-round',
    space: 'bg-repeat-space'
  },
  'background-size': {
    auto: 'bg-auto',
    cover: 'bg-cover',
    contain: 'bg-contain'
  },
  'text-decoration': {
    underline: 'underline',
    'line-through': 'line-througn',
    none: 'no-underline'
  }
}

module.exports = stylesMap
