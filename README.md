## Installation

```
npm install -g to-tailwind
```

## Usage

```html
<!-- ./test/test.html -->
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="./index.css">
</head>

<body>
  <span id="foo">
    <div class="bar">A</div>
    <div class="baz">B</div>
    <span>C</span>
  </span>
  <span></span>
</body>

</html>
```

```css
/* ./test/test.css */
#foo > div {
  color: red;
  cursor: pointer;
}
```

run

```
to-tailwind --html ./your-directory/test/index.html --css ./your-directory/test/index.css --output ./your-directory/target/output.html 
```

```html
<!-- ./target/output.html(formatted) -->
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="./index.css">
</head>

<body>
  <span id="foo">
    <div class="text-[red] cursor-pointer">A</div>
    <div class="text-[red] cursor-pointer">B</div>
    <span>C</span>
  </span>
  <span></span>
</body>

</html>
```
