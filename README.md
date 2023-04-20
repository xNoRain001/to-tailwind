## Overview

Style or class convert to Tailwind expression, then you can use Tailwind to 
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

Or inject tailwind expressions to HTML, original class name will be retained 
because javascript code may be use these class name.

Run

```
to-tailwind --html ./test/index.html --css ./test/index.css --output ./target --inject true
```

```html
<!-- ./target/index.html -->
<body>
  <ul>
    <li class="text-[red] list-item">foo</li>
    <li class="last:text-[green] list-item">bar</li>
  </ul>
</body>
```

## License

MIT
