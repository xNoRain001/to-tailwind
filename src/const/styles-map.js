const stylesMap = {
  width: 'w',
  height: 'h',
  opacity: 'opacity',
  padding: 'shorthand-padding',
  'padding-top': 'pt',
  'padding-right': 'pr',
  'padding-bottom': 'pb',
  'padding-left': 'pl',
  margin: 'shorthand-margin',
  'margin-top': 'mt',
  'margin-right': 'mr',
  'margin-bottom': 'mb',
  'margin-left': 'ml',
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
  border: 'shorthand-border',
  'border-radius': 'rounded',
  'border-width': 'shorthand-border-width',
  'border-top-width': 'border-t',
  'border-right-width': 'border-r',
  'border-bottom-width': 'border-b',
  'border-left-width': 'border-l',
  'border-top-left-radius': 'rounded-tl',
  'border-top-right-radius': 'rounded-tr',
  'border-bottom-left-radius': 'rounded-bl',
  'border-bottom-right-radius': 'rounded-br',
  'border-color': 'shorthand-border-color',
  'border-top-color': 'border-t',
  'border-right-color': 'border-r',
  'border-bottom-color': 'border-b',
  'border-left-color': 'border-l',
  'border-style': 'shorthand-border-style',
  'border-top-style': 'border-t',
  'border-right-style': 'border-r',
  'border-bottom-style': 'border-b',
  'border-left-style': 'border-l',
  'border-top': 'shorthand-border-top',
  'border-right': 'shorthand-border-right',
  'border-bottom': 'shorthand-border-bottom',
  'border-left': 'shorthand-border-left',
  color: 'text',
  'font-size': 'text',
  'font-family': 'font',
  'background-color': 'bg',
  'min-width': 'min-w',
  'flex': 'shorthand-flex',
  'flex-grow': 'flex-grow',
  'flex-shrink': 'flex-shrink',
  'flex-basis': 'flex-basis',
  'background': 'shorthand-background',
  'animation': 'shorthand-animation',
  'animation-duration': 'duration',
  'animation-name': 'animate',
  'transition': 'shorthand-transition',
  'transition-duration': 'duration',
  'transition-property': 'transition',
  'font': 'shorthand-font',
  'line-height': 'leading',
  'z-index': 'z',
  'list-style-image': 'list-image',
  'list-style': 'shorthand-list-style',
  // 'background-image': 'bg',
  'content': 'content',
  'transform': 'transform',
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
    none: 'hidden'
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
  },
  'border-style': {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
    double: 'border-double',
    hidden: 'border-hidden',
    none: 'border-none',
  },
  'vertical-align': {
    baseline: 'align-baseline',
    top: 'align-top',
    middle: 'align-middle',
    bottom: 'align-bottom',
    'text-top': 'align-text-top',
    'text-bottom': 'align-text-bottom',
    sub: 'align-sub',
    super: 'align-super'
  },
  'font-variant-numeric': {
    normal: 'normal-nums',
    ordinal: 'ordinal',
    'slashed-zero': 'slashed-zero',
    'lining-nums': 'lining-nums',
    'oldstyle-nums': 'oldstyle-nums',
    'proportional-nums': 'proportional-nums',
    'tabular-nums': 'tabular-nums',
    'diagonal-fractions': 'diagonal-fractions',
    'stacked-fractions': 'stacked-fractions'
  },
  'list-style-type': {
    none: 'list-none',
    disc: 'list-disc',
    decimal: 'list-decimal'
  },
  'list-style-position': {
    inside: 'list-inside',
    outside: 'list-outside'
  },
  'font-style': {
    italic: 'italic',
    normal: 'not-italic'
  },
  'background-size': {
    auto: 'bg-auto',
    cover: 'bg-cover',
    contain: 'bg-contain'
  },
  'background-repeat': {
    repeat: 'bg-repeat',
    'no-repeat': 'bg-no-repeat',
    'repeat-x': 'bg-repeat-x',
    'repeat-y': 'bg-repeat-y',
    round: 'bg-repeat-round',
    space: 'bg-repeat-space'
  },
  'background-position': {
    top: 'bg-top',
    right: 'bg-right',
    bottom: 'bg-bottom',
    left: 'bg-left',
    center: 'bg-center',
    'left bottom': 'bg-left-bottom',
    'left top': 'bg-left-top',
    'right bottom': 'bg-right-bottom',
    'right top': 'bg-right-top'
  },
  'background-origin': {
    'border-box': 'bg-origin-border',
    'padding-box': 'bg-origin-padding',
    'content-box': 'bg-origin-content'
  },
  'background-clip': {
    'border-box': 'bg-clip-border',
    'padding-box': 'bg-clip-padding',
    'content-box': 'bg-clip-content',
    text: 'bg-clip-text',
  },
  'background-attachment': {
    fixed: 'bg-fixed',
    local: 'bg-local',
    scroll: 'bg-scroll'
  },
  'transform-origin': {
    top: 'origin-top',
    right: 'origin-right',
    bottom: 'origin-bottom',
    left: 'origin-left',
    center: 'origin-center',
    'top-right': 'origin-top-right',
    'top-left': 'origin-top-left',
    'bottom-right': 'origin-bottom-right',
    'bottom-left': 'origin-bottom-left'
  },
  'flex-wrap': {
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse',
    nowrap: 'flex-nowrap'
  }
}

module.exports = stylesMap
