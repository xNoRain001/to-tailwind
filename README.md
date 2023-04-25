## Overview

Class convert to Tailwind expression, then you can use Tailwind to 
develop and no longer need the style files you wrote earlier.

## Installation

```
npm install -g to-tailwind
```

## Usage

```html
<!-- ./test/index.html -->
<body>
  <ul class="list">
    <li class="list-item">foo</li>
    <li class="list-item">bar</li>
  </ul>
</body>
```

```css
/* ./test/index.css */
.list > .list-item {
  color: red;
}

.list > .list-item:last-of-type {
  color: green;
}
```

Run

```
to-tailwind --html ./test/index.html --css ./test/index.css --output ./target
```

Output file

```css
/* ./target/index.css */
.list > .list-item { 
  @apply text-[red]
}

.list > .list-item:last-of-type {
  @apply last:text-[green]
}
```

## Demo

Click <a href="http://120.77.148.28">here</a>.

## License

MIT
